<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeFileRequest;
use App\Http\Requests\UpdateEmployeeFileRequest;
use App\Http\Resources\EmployeeFileResource;
use App\Models\EmployeeFile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\EmployeeFileService;

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

        $employeeFile = $this->service->ensureForUser($request->user());

        // Aquí agregar la lógica para actualizar emergency_contact_name y phone
        $employeeFile->update($request->only(['emergency_contact_name', 'emergency_contact_phone']));
    }

    public function updateStatus(Request $request, EmployeeFile $employeeFile)
    {
        $this->authorize('update', $employeeFile);
        $request->validate([
            'type'   => 'required|string',
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
