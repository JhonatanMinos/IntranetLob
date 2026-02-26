<?php

namespace App\DTOs;

use Carbon\Carbon;

class UserDTO
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public ?string $employeeNumber = null,
        public ?string $position = null,
        public ?string $phone = null,
        public ?string $birthday = null,
        public ?string $dateEntry = null,
        public ?int $departmentId = null,
        public ?string $departmentName = null,
        public ?int $companyId = null,
        public ?string $companyName = null,
        public ?int $storeId = null,
        public ?string $storeName = null,
        public ?array $roles = null,
        public ?string $emailVerifiedAt = null,
        public ?string $createdAt = null,
        public ?string $updatedAt = null,
    ) {}

    /**
     * Create DTO from a User model
     */
    public static function fromModel($user): self
    {
        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            employeeNumber: $user->employeeNumber,
            position: $user->position,
            phone: $user->phone,
            birthday: $user->birthday?->toDateString(),
            dateEntry: $user->date_entry?->toDateString(),
            departmentId: $user->department_id,
            departmentName: $user->department?->name,
            companyId: $user->company_id,
            companyName: $user->company?->name,
            storeId: $user->store_id,
            storeName: $user->store?->name,
            roles: $user->getRoleNames()->toArray(),
            emailVerifiedAt: $user->email_verified_at?->toIso8601String(),
            createdAt: $user->created_at?->toIso8601String(),
            updatedAt: $user->updated_at?->toIso8601String(),
        );
    }

    /**
     * Convert DTO to array for JSON response
     */
    public function toArray(): array
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
        ];
    }
}
