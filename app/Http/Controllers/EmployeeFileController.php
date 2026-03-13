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
        return Inertia::render('EmployeeFiles/status', [
            'employeeFile' => EmployeeFileResource::make($employeeFile)->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request)
    {
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
        //
    }

    public function updateStatus(Request $request, EmployeeFile $employeeFile)
    {
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
    }

    public function updateDocument(Request $request, EmployeeFile $employeeFile)
    {
        $this->service->updateDocument(
            $employeeFile,
            $request->type,
            $request->file('document')
        );
    }


    /**
    * download the specified file
    */
    public function download(EmployeeFile $employeeFile, string $type)
    {
        return $this->service->downloadResponse($employeeFile, $type);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EmployeeFile $employeeFile)
    {
        //
    }
}
