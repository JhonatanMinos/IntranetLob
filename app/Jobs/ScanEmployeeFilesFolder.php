<?php

namespace App\Jobs;

use App\Models\PayRollFiles;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use SplFileInfo;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use Throwable;

class ScanEmployeeFilesFolder implements ShouldQueue
{
    use Queueable;
    use InteractsWithQueue;
    use Dispatchable;
    use SerializesModels;

    public int $tries = 3;
    public int $timeuut = 600;
    public int $year;

    private const ALLOWED_EXTENSIONS = ['pdf'];

    /**
     * Create a new job instance.
     */
    public function __construct(?int $year = null)
    {
        $this->year = $year ?? (int) date('Y');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $basePath = config('payroll.scan_folder'); // /mnt/recibos/

        // 2. Construir ruta al año: /mnt/recibos/Recibos Procesados 2026
        $yearPath = rtrim($basePath, '/') . "/Recibos Procesados {$this->year}";

        Log::info("--- INICIANDO ESCANEO GLOBAL {$this->year} ---");
        Log::info("--- Path Dentro {$yearPath} ---");

        if (!is_dir($yearPath)) {
            Log::error("ScanEmployeeFilesFolder: Carpeta del año no encontrada [{$yearPath}]");
            return;
        }
        // Usamos scandir para estar 100% seguros de lo que ve PHP
        $companyFolders = array_filter(glob($yearPath . '/*'), 'is_dir');
        $employeeMap = User::pluck('id', 'employeeNumber')->all();

        foreach ($companyFolders as $companyPath) {
            // OBTENEMOS LAS 6 MÁS RECIENTES
            $latestFolders = $this->getLatestFolders($companyPath, 6);

            if (!empty($latestFolders)) {
                foreach ($latestFolders as $folder) {
                    Log::info("ScanEmployeeFilesFolder: Escaneando carpeta [{$folder}]");
                    $this->scanFolder($folder, $employeeMap);
                }
            } else {
                Log::warning("No se encontraron carpetas en: {$companyPath}");
            }
        }
        Log::info("--- ESCANEO FINALIZADO ---");
    }

    private function scanFolder(string $path, array $employeeMap): void
    {
        // Usamos el iterador directamente para ahorrar memoria RAM
        $directory = new RecursiveDirectoryIterator($path, RecursiveDirectoryIterator::SKIP_DOTS);
        $iterator = new RecursiveIteratorIterator($directory);

        foreach ($iterator as $file) {
            /** @var SplFileInfo $file */
            if (!$file->isFile() || !in_array(strtolower($file->getExtension()), self::ALLOWED_EXTENSIONS)) {
                continue;
            }

            try {
                $this->processFile($file, $employeeMap);
            } catch (Throwable $e) {
                Log::error("Error procesando {$file->getFilename()}: " . $e->getMessage());
            }
        }
    }

    // ─────────────────────────────────────────
    // Procesar cada archivo
    // ─────────────────────────────────────────

    private function processFile(SplFileInfo $file, array $employeeMap): string
    {
        $filename = $file->getFilename();
        $extractedNumber = $this->extractNumberOnly($filename);
        // Si ya existe en la tabla, saltar
        $userId = $employeeMap[$extractedNumber] ?? $employeeMap[ltrim($extractedNumber, '0')] ?? null;

        if (!$userId) {
            Log::warning("Archivo sin dueño: {$filename} (Número extraído: {$extractedNumber})");
            return 'failed';
        }
        PayRollFiles::updateOrCreate(
            [
                'file_path'     => $file->getPath(),
                'original_name' => $filename,
            ],
            [
                'user_id'    => $userId,
                'mime_type'  => 'application/pdf',
                'file_size'  => $file->getSize(),
                'processed'  => false,
            ]
        );

        return 'inserted';
    }


    private function extractNumberOnly(string $filename): ?string
    {
        $name = pathinfo($filename, PATHINFO_FILENAME);

        // Patrón 1: empieza con número → 12345_...
        /*if (preg_match('/^(\d{4,6})/', $name, $matches)) {
            $number = $matches[1];
            if (isset($employeeNumbers[$number])) {
                return $number;
            }
        }*/

        // Patrón 2: termina con número → ..._12345
        /*if (preg_match('/(\d{4,6})$/', $name, $matches)) {
            $number = $matches[1];
            if (isset($employeeNumbers[$number])) {
                return $number;
            }
        }*/

        // Patrón 3: número en cualquier parte → NOMINA_12345_2024
        /*if (preg_match('/[_\-](\d{4,6})[_\-]/', $name, $matches)) {
            $number = $matches[1];
            if (isset($employeeNumbers[$number])) {
                return $number;
            }
        }*/

        if (preg_match('/(?:\s|-)(\d{4,6})(?:_|\.|$)/', $name, $matches)) {
            $number = $matches[1];
            $number = (string) intval($number);
            return $number;
        }

        // No se encontró match
        return null;
    }

    private function getLatestFolders(string $path, int $limit = 6): array
    {
        $fifteenDaysAgo = time() - (15 * 24 * 60 * 60);

        \Log::info("=== DEBUG getLatestFolders ===");
        \Log::info("Path buscado: {$path}");
        \Log::info("Path existe: " . (is_dir($path) ? 'SÍ' : 'NO'));
        \Log::info("Permisos: " . decoct(fileperms($path)));
        \Log::info("Fecha límite: " . date('Y-m-d H:i:s', $fifteenDaysAgo));
        \Log::info("Hoy: " . date('Y-m-d H:i:s'));

        if (!is_dir($path)) {
            \Log::error("Path no es directorio: {$path}");
            return [];
        }

        $items = @scandir($path);
        \Log::info("Total items encontrados: " . count($items));

        $allFolders = [];

        foreach ($items as $item) {
            if ($item === '.' || $item === '..') {
                continue;
            }

            $fullPath = $path . DIRECTORY_SEPARATOR . $item;
            $isDir = is_dir($fullPath);
            $mtime = @filemtime($fullPath);
            $mtimeDate = $mtime ? date('Y-m-d H:i:s', $mtime) : 'N/A';
            $isRecent = $mtime && $mtime >= $fifteenDaysAgo;

            \Log::info("Item: {$item}", [
                'is_dir' => $isDir,
                'mtime' => $mtimeDate,
                'is_recent' => $isRecent,
            ]);

            if (!is_dir($fullPath)) {
                continue;
            }

            $mtime = @filemtime($fullPath);
            if ($mtime && $mtime >= $fifteenDaysAgo) {
                $allFolders[] = [
                    'path' => $fullPath,
                    'mtime' => $mtime,
                ];
            }
        }

        \Log::info("Carpetas recientes encontradas: " . count($allFolders));

        if (empty($allFolders)) {
            return [];
        }

        usort($allFolders, fn($a, $b) => $b['mtime'] - $a['mtime']);

        return array_slice(
            array_map(fn($item) => $item['path'], $allFolders),
            0,
            $limit
        );
    }

    public function failed(Throwable $e): void
    {
        Log::error("ScanEmployeeFilesFolder: Job falló definitivamente", [
            'folder' => $this->folderPath,
            'error'  => $e->getMessage(),
        ]);
    }
}
