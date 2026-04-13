<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserRepository implements RepositoryInterface
{
    protected $model;

    public function __construct(User $user)
    {
        $this->model = $user;
    }

    public function all(): Collection
    {
        return $this->model->with('department', 'company', 'store')->get();
    }

    public function find(int $id): ?User
    {
        return $this->model->with('department', 'company', 'store')->find($id);
    }

    public function create(array $data): User
    {
        return $this->model->create($data);
    }

    public function update($model, array $data): User
    {
        $model->update($data);
        return $model;
    }

    public function delete($model): bool
    {
        return $model->delete();
    }

    public function search(?string $search = null): LengthAwarePaginator
    {
        return $this->model->with('department', 'company', 'store')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('employeeNumber', 'like', "%{$search}%")
                      ->orWhereHas('department', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->orderBy('department_id')
            ->paginate(10);
    }
}

