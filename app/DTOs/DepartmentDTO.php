<?php

namespace App\DTOs;

class DepartmentDTO
{
    public function __construct(
        public int $id,
        public string $name,
        public ?string $description = null,
        public ?string $createdAt = null,
        public ?string $updatedAt = null,
        public ?string $deletedAt = null,
    ) {}

    /**
     * Create DTO from a Department model
     */
    public static function fromModel($department): self
    {
        return new self(
            id: $department->id,
            name: $department->name,
            description: $department->description ?? null,
            createdAt: $department->created_at?->toIso8601String(),
            updatedAt: $department->updated_at?->toIso8601String(),
            deletedAt: $department->deleted_at?->toIso8601String(),
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
            'description' => $this->description,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
            'deletedAt' => $this->deletedAt,
        ];
    }
}
