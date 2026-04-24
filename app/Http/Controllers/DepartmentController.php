<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $userAll = User::count();
        $query = Department::with('users')
            ->when($search, function ($q) use ($search) {
                return Department::search($search)
                    ->query(fn($q) => $q->with('users'));
            });

        $data = $query->orderBy('name')->paginate(10)->withQueryString();

        if ($request->wantsJson()) {
            // 1. Usamos el Resource para que la estructura sea idéntica a la de React
            // 2. Quitamos el 201 y dejamos el 200 por defecto
            return DepartmentResource::collection($data);
        }

        return Inertia::render('rrhh/departments', [
            'data' => DepartmentResource::collection($data),
            'userAll' => $userAll,
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
    public function store(StoreDepartmentRequest $request)
    {
        $this->authorize('create', Department::class);

        $department = Department::create([
            'name' => $request->name,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'data' => $department
            ], 201);
        }

        return back()->with('success', 'Departamento creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Department $department)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Department $department)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDepartmentRequest $request, Department $department)
    {
        $this->authorize('update', $department);

        $department->update([
            'name' => $request->name,
        ]);

        return back()->with('success', 'Departamento actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Department $department)
    {
        $this->authorize('delete', $department);
        $department->delete();
        return back()->with('success', 'Departamento eliminado correctamente.');
    }
}
