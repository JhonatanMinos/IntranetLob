<?php

namespace App\Services;

use App\DTOs\UserDTO;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * Search users with optional filters
     */
    public function searchUsers(?string $search = null, int $page = 1): LengthAwarePaginator
    {
        $query = User::with('department', 'company', 'store')
            ->when($search, function ($q) use ($search) {
                return User::search($search)
                    ->query(fn($q) => $q->with('department', 'company', 'store'));
            });

        return $query->orderBy('department_id')
            ->paginate(10, ['*'], 'page', $page)
            ->withQueryString();
    }

    /**
     * Get all users with relationships
     */
    public function getAllUsers(): \Illuminate\Database\Eloquent\Collection
    {
        return User::with('department', 'company', 'store')->get();
    }

    /**
     * Get a user by ID
     */
    public function getUserById(int $userId): ?UserDTO
    {
        $user = User::with('department', 'company', 'store')
            ->find($userId);

        return $user ? UserDTO::fromModel($user) : null;
    }

    /**
     * Create a new user
     */
    public function createUser(array $data): UserDTO
    {
        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);
        $user->load('department', 'company', 'store');

        return UserDTO::fromModel($user);
    }

    /**
     * Update an existing user
     */
    public function updateUser(User $user, array $data): UserDTO
    {
        // Remove password from data if it's not filled or empty
        if (empty($data['password'] ?? null)) {
            unset($data['password']);
        } else {
            $data['password'] = Hash::make($data['password']);
        }

        $user->fill($data);
        $user->save();
        $user->load('department', 'company', 'store');

        return UserDTO::fromModel($user);
    }

    /**
     * Delete a user (soft delete)
     */
    public function deleteUser(User $user): bool
    {
        return $user->delete();
    }

    /**
     * Assign role to user
     */
    public function assignRole(User $user, int $roleId): void
    {
        $role = \Spatie\Permission\Models\Role::find($roleId);
        if ($role) {
            $user->syncRoles([$role]);
        }
    }

    /**
     * Convert users collection to DTOs
     */
    public function toUserDTOs(\Illuminate\Database\Eloquent\Collection $users): array
    {
        return $users->map(fn($user) => UserDTO::fromModel($user))->toArray();
    }
}
