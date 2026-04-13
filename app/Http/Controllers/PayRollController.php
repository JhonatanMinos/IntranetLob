<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePayrollRequest;
use App\Http\Resources\PayrollResource;
use App\Jobs\ExtractPayrollZip;
use App\Models\PayRoll;
use App\Models\PayRollFiles;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PayRollController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        //Views all register Nominal in db only range
        /*$uploads = PayRoll::with(['uploader:id,name'])
            ->paginate(15)
            ->withQueryString();
        return Inertia::render('rrhh/payrolls', [
            'uploads' => PayrollResource::collection($uploads),
        ]);*/
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // View a drops & drap for zip generer register
        return Inertia::render('rrhh/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePayrollRequest $request)
    {
        dd($request->all(), $request->file('zip_file'));
        //Update more the one file in zip
        $data = $request->validated();

        $path = $request->file('zip_file')->store('payroll/' . $data['period_start'], 'local');
        $data['zip_file'] = $path;

        $upload = PayRoll::create([
            'user_id'           => auth()->id(),
            'period_start'      => $data['period_start'],
            'period_end'        => $data['period_end'],
            'period_type'       => $data['period_type'],
            'zip_path'          => $path,
            'zip_original_name' => $request->file('zip_file')->getClientOriginalName(),
            'zip_size'          => $request->file('zip_file')->getSize(),
            'status'            => 'pending',
        ]);

        ExtractPayrollZip::dispatch($upload)
           ->onQueue('default')
           ->delay(now()->addSeconds(2));

        return redirect()->route('payroll.index')->with('succes', 'Zip subido correctamente. Procesando en segundo plano...');
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
