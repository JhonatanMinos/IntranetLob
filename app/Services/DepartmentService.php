<?php

namespace App\Services;

use App\DTOs\DepartmentDTO;
use App\Models\Department;

class DepartmentService
{
    /**
     * Get all departments
     */
    public function getAllDepartments(): \Illuminate\Database\Eloquent\Collection
    {
        return Department::orderBy('name')->get();
    }

    /**
     * Get a department by ID
     */
    public function getDepartmentById(int $id): ?DepartmentDTO
    {
        $department = Department::find($id);
        return $department ? DepartmentDTO::fromModel($department) : null;
    }

    /**
     * Create a new department
     */
    public function createDepartment(array $data): DepartmentDTO
    {
        $department = Department::create($data);
        return DepartmentDTO::fromModel($department);
    }

    /**
     * Update a department
     */
    public function updateDepartment(Department $department, array $data): DepartmentDTO
    {
        $department->update($data);
        return DepartmentDTO::fromModel($department);
    }

    /**
     * Delete a department
     */
    public function deleteDepartment(Department $department): bool
    {
        return $department->delete();
    }

    /**
     * Convert departments collection to DTOs
     */
    public function toDepartmentDTOs(\Illuminate\Database\Eloquent\Collection $departments): array
    {
        return $departments->map(fn($d) => DepartmentDTO::fromModel($d))->toArray();
    }
}
