<?php

namespace App\DTOs;

class BrandDTO
{
    public function __construct(
        public int $id,
        public string $name,
        public string $slug,
        public ?string $description = null,
        public ?string $createdAt = null,
        public ?string $updatedAt = null,
        public ?string $deletedAt = null,
    ) {}

    /**
     * Create DTO from a Brand model
     */
    public static function fromModel($brand): self
    {
        return new self(
            id: $brand->id,
            name: $brand->name,
            slug: $brand->slug,
            description: $brand->description ?? null,
            createdAt: $brand->created_at?->toIso8601String(),
            updatedAt: $brand->updated_at?->toIso8601String(),
            deletedAt: $brand->deleted_at?->toIso8601String(),
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
            'slug' => $this->slug,
            'description' => $this->description,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
            'deletedAt' => $this->deletedAt,
        ];
    }
}
