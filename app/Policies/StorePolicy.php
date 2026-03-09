<?php

namespace App\Policies;

use App\Models\Store;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class StorePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('sa') || $user->hasRole('rh') || $user->hasRole('user');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Store $store): bool
    {
        if ($user->hasRole('sa') || $user->hasRole('rh')) {
            return true;
        }
        // Gerente puede ver solo su tienda
        return $user->store_id === $store->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo("create shop");
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Store $store): bool
    {
        if ($user->hasRole('sa')) {
            return true;
        }
        // Gerente puede actualizar su tienda
        return $user->hasRole('gerente') && $user->store_id === $store->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Store $store): bool
    {
        return $user->hasRole('sa');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Store $store): bool
    {
        return $user->hasRole('sa');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Store $store): bool
    {
        return $user->hasRole('sa');
    }
}
