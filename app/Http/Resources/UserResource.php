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
            'departmentId' => $this->departmentId,
            'departmentName' => $this->departmentName,
            'companyId' => $this->companyId,
            'companyName' => $this->companyName,
            'storeId' => $this->storeId,
            'storeName' => $this->storeName,
            'roles' => $this->roles,
            'emailVerifiedAt' => $this->emailVerifiedAt,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
            'can' => [
                'update' => $request->user()->can('update', $this->resource),
                'delete' => $request->user()->can('delete', $this->resource),
            ],
        ];
    }
}
