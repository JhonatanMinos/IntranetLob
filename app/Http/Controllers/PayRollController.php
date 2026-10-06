<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePayrollRequest;
use App\Http\Resources\UserResource;
use App\Models\PayRollFiles;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PayRollController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', PayRollFiles::class);
        $totalUsers = User::count();
        $usersWithFiles = User::whereHas('payrollFiles')->count();
        $users = User::with(['department', 'company', 'store'])->whereDoesntHave('payrollFiles')->get();

        return Inertia::render('rrhh/payrolls', [
            'users' => UserResource::collection($users),
            'stats' => [
                'period' => PayRollFiles::latest()->first()?->created_at->format('Y-m') ?? now()->format('Y-m'),
                'usersWithFiles' => $usersWithFiles,
                'usersWithoutFiles' => $totalUsers - $usersWithFiles,
                'totalUsers' => $totalUsers,
                'coverage' => $totalUsers > 0 ? round($usersWithFiles / $totalUsers * 100, 2) : 0,
            ],
        ]);
    }

    public function create(User $user): Response
    {
        $this->authorize('create', PayRollFiles::class);

        return Inertia::render('rrhh/Create', ['user' => $user]);
    }

    public function store(StorePayrollRequest $request)
    {
        $this->authorize('create', PayRollFiles::class);
        $file = $request->file('file');
        $path = $file->store('payroll', 'local');
        abort_if(! $path, 500, 'No se pudo guardar la nómina.');
        try {
            PayRollFiles::create([
                'file_path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
                'user_id' => $request->validated('user_id'),
                'processed' => true,
                'error_message' => null,
            ]);
        } catch (\Throwable $e) {
            Storage::disk('local')->delete($path);
            Log::error('Payroll upload failed', ['user_id' => auth()->id(), 'error' => $e->getMessage()]);

            return back()->withErrors(['file' => 'Error al guardar la nómina.']);
        }

        return to_route('payroll.index')->with('success', 'Nómina guardada correctamente.');
    }

    public function destroy(PayRollFiles $payroll)
    {
        $this->authorize('delete', $payroll);
        // Los recibos importados pertenecen al sistema externo; solo se desvinculan.
        if (! str_starts_with($payroll->file_path, '/')) {
            abort_unless(Storage::disk('local')->delete($payroll->file_path), 500, 'No se pudo eliminar el archivo.');
        }
        $payroll->delete();

        return to_route('payroll.index')->with('success', 'Nómina eliminada.');
    }

    public function download(string $id)
    {
        $file = PayRollFiles::findOrFail($id);
        $this->authorize('view', $file);
        if (str_starts_with($file->file_path, '/')) {
            $root = realpath(config('payroll.scan_folder'));
            $path = realpath($file->file_path.'/'.$file->original_name);
            abort_unless($root && $path && str_starts_with($path, rtrim($root, '/').'/') && is_file($path), 404);

            return response()->download($path, $file->original_name);
        }
        abort_unless(Storage::disk('local')->exists($file->file_path), 404);

        return Storage::disk('local')->download($file->file_path, $file->original_name);
    }
}
