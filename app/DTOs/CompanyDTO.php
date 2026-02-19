<?php

namespace App\DTOs;

class CompanyDTO
{
    public function __construct(
        public int $id,
        public string $name,
        public ?string $createdAt = null,
        public ?string $updatedAt = null,
        public ?string $deletedAt = null,
    ) {}

    /**
     * Create DTO from a Company model
     */
    public static function fromModel($company): self
    {
        return new self(
            id: $company->id,
            name: $company->name,
            createdAt: $company->created_at?->toIso8601String(),
            updatedAt: $company->updated_at?->toIso8601String(),
            deletedAt: $company->deleted_at?->toIso8601String(),
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
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
            'deletedAt' => $this->deletedAt,
        ];
    }
}
