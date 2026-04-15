<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePayrollRequest;
use App\Http\Resources\PayrollResource;
use App\Http\Resources\UserResource;
use App\Jobs\ExtractPayrollZip;
use App\Models\PayRollFiles;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class PayRollController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        // Usuarios que TIENEN archivos PayRoll relacionados
        $usersWithFiles = User::whereHas('payrollFiles')->count();

        // Usuarios que NO TIENEN archivos
        $usersWithoutFiles = User::whereDoesntHave('payrollFiles')->count();

        // Total de usuarios (verificación)
        $totalUsers = User::count();

        // Obtener los uploads para la tabla
        $usersWithoutPayroll = User::whereDoesntHave('payrollFiles')->get();

        $currentPeriod = PayRollFiles::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as period'),
            'created_at'
        )
            ->distinct()
            ->latest('created_at')
            ->first();

        $period = $currentPeriod?->period ?? now()->format('Y-m');


        return Inertia::render('rrhh/payrolls', [
            'users' => UserResource::collection($usersWithoutPayroll),
            'stats' => [
                'period' => $period,
                'usersWithFiles' => $usersWithFiles,
                'usersWithoutFiles' => $usersWithoutFiles,
                'totalUsers' => $totalUsers,
                'coverage' => $totalUsers > 0 ? round(($usersWithFiles / $totalUsers) * 100, 2) : 0,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(User $user)
    {
        // View a drops & drap for zip generer register
        return Inertia::render('rrhh/Create', ['user' => $user]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePayrollRequest $request)
    {
        $data = $request->validated();
        $file = $request->file('file');

        try {
            $path = $file->store('payroll', 'local');
            // Crear registro
            PayRollFiles::create([
                'file_path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
                'user_id' => $data['user_id'],
                'processed' => false,
                'error_message' => null,
            ]);

            return redirect()
                ->route('payroll.index')
                ->with('success', 'Nómina subida correctamente. Procesando...');
        } catch (\Exception $e) {
            \Log::error('Payroll upload failed', [
                'user_id' => auth()->id(),
                'target_user' => $data['user_id'],
                'error' => $e->getMessage(),
            ]);

            return back()
                ->withInput()
                ->withErrors(['file' => 'Error al subir el archivo']);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //view files relation with user for employeeNumber
    }

    /**
     * Show the form for editing the specified resource.
     */

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PayRoll $payroll)
    {
        if ($payroll->status === 'processing') {
            return back()->with('error', 'No se puede eliminar un ZIP en proceso.');
        }

        // Eliminar ZIP del storage
        Storage::disk('local')->delete($payroll->zip_path);

        // Eliminar archivos extraídos
        foreach ($payroll->files as $file) {
            Storage::disk('local')->delete($file->file_path);
        }

        $payroll->delete();

        return redirect()
            ->route('payroll.index')
            ->with('success', 'Registro eliminado correctamente.');
    }

    // ─────────────────────────────────────────
    // POST /payroll-uploads/{payrollUpload}/retry
    // Reintentar si falló
    // ─────────────────────────────────────────
    public function retry(Payroll $payroll): RedirectResponse
    {
        if (!$payroll->hasFailed()) {
            return redirect()->route('payroll.index')->with('error', 'Solo se pueden reintentar uploads fallidos.');
            ExtractPayrollZip::dispatch($payroll)->onQueue('default');
        }


        // Resetear contadores
        $payroll->update([
            'status'          => 'pending',
            'error_message'   => null,
            'processed_files' => 0,
            'total_files'     => 0,
        ]);

        // Eliminar archivos anteriores para reprocesar limpio
        $payroll->files()->delete();

        ExtractPayrollZip::dispatch($payroll)->onQueue('default');

        return back()->with('success', 'Reprocesando ZIP...');
    }

    // ─────────────────────────────────────────
    // GET /payroll-uploads/{payrollUpload}/status
    // Polling desde el frontend para actualizar progreso
    // ─────────────────────────────────────────
    public function status(Payroll $payroll): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'status'          => $payroll->status,
            'progress'        => $payroll->progress,
            'total_files'     => $payroll->total_files,
            'processed_files' => $payroll->processed_files,
            'error_message'   => $payroll->error_message,
        ]);
    }

    public function download($id)
    {
        $file = PayRollFiles::findOrFail($id);
        $fullPath = $file->file_path . '/' . $file->original_name;
        if (!file_exists($fullPath)) {
            abort(404, 'Archivo no encontrado físicamente.');
        }

        return response()->download($fullPath, $file->original_name);
    }
}
