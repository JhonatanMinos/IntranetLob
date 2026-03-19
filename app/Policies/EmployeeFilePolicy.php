<?php

namespace App\Policies;

use App\Models\EmployeeFile;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class EmployeeFilePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('sa') || $user->hasRole('rh');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, EmployeeFile $employeeFile): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('sa') || $user->hasRole('rh') || $user->hasRole('user');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, EmployeeFile $employeeFile): bool
    {

        if ($user->hasRole('sa') || $user->hasRole('rh')) {
            return true;
        }

        return $user->id === $employeeFile->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, EmployeeFile $employeeFile): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, EmployeeFile $employeeFile): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, EmployeeFile $employeeFile): bool
    {
        return false;
    }
}
