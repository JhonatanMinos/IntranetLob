<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'employeeNumber' => $this->employeeNumber,
            'position' => $this->position,
            'phone' => $this->phone,
            'birthday' => $this->birthday,
            'dateEntry' => $this->dateEntry,
            'departmentId' => $this->department_id,
            'departmentName' => $this->department?->name,
            'companyId' => $this->company_id,
            'companyName' => $this->company?->name,
            'storeId' => $this->store_id,
            'storeName' => $this->store?->name,
            'roles' => $this->roles,
            'avatarPath' => $this->avatar_path,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'can' => [
                'update' => $request->user()->can('update', $this->resource),
                'delete' => $request->user()->can('delete', $this->resource),
            ],
        ];
    }
}
