<?php

namespace App\Jobs;

use App\Models\PayRoll;
use App\Models\PayRollFiles;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Throwable;
use ZipArchive;

class ExtractPayrollZip implements ShouldQueue
{
    use Queueable;
    use Dispatchable;
    use InteractsWithQueue;
    use SerializesModels;

    //Reintentos si falla
    public int $tries = 3;

    //Timeout maximo - ZIPs grandes pueden tardar
    public int $timeout = 120;

    //Backoof enter reintentos(segundos)
    public array $backoff = [10,30,60];

    /**
     * Create a new job instance.
     */
    public function __construct(private readonly PayRoll $upload)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->upload->update(['status' => 'processing']);

        $zipPath = Storage::path($this->upload->zip_path);
        $extractTo = $this->extractionPath();

        try {
            $this->extractZip($zipPath, $extractTo);
            $files = $this->getExtractedFiles($extractTo);

            if (empty($files)) {
                throw new \RuntimeException("El ZIP no contiene archivos validos");
            }

            // Procesar cada archivo en una transacción
            DB::transaction(function () use ($files, $extractTo) {
                foreach ($files as $file) {
                    $this->processFile($file, $extractTo);
                }
            });

            $this->upload->update([
                'status'       => 'completed',
                'processed_at' => now(),
            ]);
        } catch (Throwable $e) {
            $this->handleFailure($e);
        } finally {
            $this->cleanupTempFiles($extractTo);
        }
    }

    // ─────────────────────────────────────────
    // Extracción del ZIP
    // ─────────────────────────────────────────

    private function extractZip(string $zipPath, string $destination): void
    {
        if (!file_exists($zipPath)) {
            throw new \RuntimeException("ZIP no encontrado: {$zipPath}");
        }

        $zip = new ZipArchive();
        $result = $zip->open($zipPath);

        if ($result !== true) {
            throw new \RuntimeException(
                "No se pudo abrir el ZIP. Código de error: {$result}"
            );
        }

        // Verificar que no venga vacío
        if ($zip->count() === 0) {
            $zip->close();
            throw new \RuntimeException('El ZIP está vacío.');
        }

        if (!$zip->extractTo($destination)) {
            $zip->close();
            throw new \RuntimeException('Error al extraer el ZIP.');
        }

        $zip->close();
    }

    // ─────────────────────────────────────────
    // Obtener archivos extraídos (solo PDFs)
    // ─────────────────────────────────────────

    private function getExtractedFiles(string $directory): array
    {
        $allowed = ['pdf', 'xlsx', 'csv'];

        return collect(new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator(
                $directory,
                \RecursiveDirectoryIterator::SKIP_DOTS
            )
        ))
        ->filter(
            fn($file)
            => $file->isFile()
            && in_array(strtolower($file->getExtension()), $allowed)
        )
        ->values()
        ->all();
    }

    // ─────────────────────────────────────────
    // Procesar cada archivo
    // ─────────────────────────────────────────

    private function processFile(\SplFileInfo $file, string $tempPath): void
    {
        try {
            // Intentar encontrar el empleado por nombre de archivo
            // Convención esperada: "12345_APELLIDO_NOMBRE.pdf" o "APELLIDO_NOMBRE.pdf"
            $employee   = $this->matchEmployee($file->getFilename());
            $storedPath = $this->storeFile($file);

            PayRollFiles::create([
                'payroll_upload_id' => $this->upload->id,
                'employee_id'       => $employee?->id,
                'file_path'         => $storedPath,
                'original_name'     => $file->getFilename(),
                'mime_type'         => mime_content_type($file->getPathname()),
                'file_size'         => $file->getSize(),
                'status'            => $employee ? 'matched' : 'unmatched',
            ]);
        } catch (Throwable $e) {
            // Un archivo fallido no detiene el resto
            Log::warning("PayrollUpload [{$this->upload->id}] archivo fallido: {$file->getFilename()}", [
                'error' => $e->getMessage(),
            ]);

            PayRollFiles::create([
                'payroll_upload_id' => $this->upload->id,
                'employee_id'       => null,
                'file_path'         => '',
                'original_name'     => $file->getFilename(),
                'mime_type'         => '',
                'file_size'         => $file->getSize(),
                'status'            => 'failed',
                'error_message'     => $e->getMessage(),
            ]);
        } finally {
            // Siempre incrementar el contador de procesados
            $this->upload->increment('processed_files');
        }
    }

    // ─────────────────────────────────────────
    // Match empleado por nombre de archivo
    // ─────────────────────────────────────────
    private function matchEmployee(string $filename): ?User
    {
        // Quitar extensión
        $name = pathinfo($filename, PATHINFO_FILENAME);

        // Intentar por número de empleado primero: "12345_..."
        if (preg_match('/^(\d+)_/', $name, $matches)) {
            $employee = User::where('employeeNumber', $matches[1])->first();
            if ($employee) {
                return $employee;
            }
        }

        // Fallback: buscar por nombre normalizado
        $normalized = str_replace(['_', '-'], ' ', $name);
        $normalized = preg_replace('/\d+/', '', $normalized);
        $normalized = trim($normalized);

        return User::whereRaw(
            "LOWER(CONCAT(name)) LIKE ?",
            ['%' . strtolower($normalized) . '%']
        )->first();
    }

    // ─────────────────────────────────────────
    // Mover archivo a storage permanente
    // ─────────────────────────────────────────

    private function storeFile(\SplFileInfo $file): string
    {
        $destination = sprintf(
            'payroll/%s/%s/%s',
            $this->upload->period_start->format('Y'),
            $this->upload->period_start->format('m'),
            $file->getFilename()
        );

        Storage::put(
            $destination,
            file_get_contents($file->getPathname())
        );

        return $destination;
    }

    // ─────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────

    private function extractionPath(): string
    {
        $path = storage_path("app/temp/payroll/{$this->upload->id}");

        if (!is_dir($path)) {
            mkdir($path, 0o755, true);
        }

        return $path;
    }

    private function cleanupTempFiles(string $path): void
    {
        if (is_dir($path)) {
            // Eliminar directorio temporal recursivamente
            $files = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($path, \RecursiveDirectoryIterator::SKIP_DOTS),
                \RecursiveIteratorIterator::CHILD_FIRST
            );

            foreach ($files as $file) {
                $file->isDir() ? rmdir($file->getPathname()) : unlink($file->getPathname());
            }

            rmdir($path);
        }
    }

    private function handleFailure(Throwable $e): void
    {
        Log::error("PayrollUpload [{$this->upload->id}] falló.", [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);

        $this->upload->update([
            'status'        => 'failed',
            'error_message' => $e->getMessage(),
        ]);
    }

    // Se llama cuando se agotan los reintentos
    public function failed(Throwable $e): void
    {
        $this->handleFailure($e);
    }
}
