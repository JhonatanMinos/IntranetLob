<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeFileRequest;
use App\Http\Requests\UpdateEmployeeFileRequest;
use App\Http\Resources\EmployeeFileResource;
use App\Models\EmployeeFile;
use App\Services\EmployeeFileService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmployeeFileController extends Controller
{
    private $service;

    public function __construct(EmployeeFileService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', EmployeeFile::class);
        $employeeFile = $this->service->paginate($request->search);

        return Inertia::render('employee-files', [
            'data' => EmployeeFileResource::collection($employeeFile),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEmployeeFileRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(EmployeeFile $employeeFile)
    {
        $this->authorize('view', $employeeFile);

        return Inertia::render('EmployeeFiles/status', [
            'employeeFile' => EmployeeFileResource::make($employeeFile)->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request)
    {
        $this->authorize('create', EmployeeFile::class);
        $employeeFile = $this->service->ensureForUser($request->user());

        return Inertia::render('settings/employee-files', [
            'employeeFile' => $employeeFile,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEmployeeFileRequest $request, EmployeeFile $employeeFile)
    {
        $this->authorize('update', $employeeFile);

        // Aquí agregar la lógica para actualizar emergency_contact_name y phone
        $employeeFile->update($request->validated());

        return back()->with('success', 'Contacto actualizado.');
    }

    public function updateStatus(Request $request, EmployeeFile $employeeFile)
    {
        $this->authorize('review', $employeeFile);
        $request->validate([
            'type' => ['required', Rule::in(EmployeeFileService::DOCUMENT_TYPES)],
            'note' => 'nullable|string|max:2000',
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $this->service->updateStatus(
            $employeeFile,
            $request->type,
            $request->status,
            $request->note ?? ''
        );

        return back()->with('success', 'Se actualizo el estatus del documento');
    }

    public function updateDocument(Request $request, EmployeeFile $employeeFile)
    {
        $this->authorize('update', $employeeFile);
        $request->validate([
            'type' => ['required', Rule::in(EmployeeFileService::DOCUMENT_TYPES)],
            'document' => 'required|file|mimes:pdf,jpg,jpeg,png,webp|max:10240',
        ]);
        $this->service->updateDocument(
            $employeeFile,
            $request->type,
            $request->file('document')
        );

        return back()->with('success', 'Archivo subido con exito');
    }

    /**
     * download the specified file
     */
    public function download(EmployeeFile $employeeFile, string $type)
    {
        $this->authorize('view', $employeeFile);

        return $this->service->downloadResponse($employeeFile, $type);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EmployeeFile $employeeFile)
    {
        $this->authorize('delete', $employeeFile);
    }
}
