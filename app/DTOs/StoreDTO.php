<?php

namespace App\DTOs;

class StoreDTO
{
    public function __construct(
        public int $id,
        public string $name,
        public string $code,
        public string $type,
        public string $address,
        public string $neighborhood,
        public string $city,
        public string $postalCode,
        public string $state,
        public ?int $brandId = null,
        public ?string $brandName = null,
        public ?string $phone = null,
        public ?string $email = null,
        public ?float $lat = null,
        public ?float $lng = null,
        public ?string $createdAt = null,
        public ?string $updatedAt = null,
        public ?string $deletedAt = null,
    ) {}

    /**
     * Create DTO from a Store model
     */
    public static function fromModel($store): self
    {
        return new self(
            id: $store->id,
            name: $store->name,
            code: $store->code,
            type: $store->type,
            address: $store->address,
            neighborhood: $store->neighborhood,
            city: $store->city,
            postalCode: $store->postal_code,
            state: $store->state,
            brandId: $store->brand_id,
            brandName: $store->brand?->name,
            phone: $store->phone,
            email: $store->email,
            lat: $store->lat ? (float) $store->lat : null,
            lng: $store->lng ? (float) $store->lng : null,
            createdAt: $store->created_at?->toIso8601String(),
            updatedAt: $store->updated_at?->toIso8601String(),
            deletedAt: $store->deleted_at?->toIso8601String(),
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
            'code' => $this->code,
            'type' => $this->type,
            'address' => $this->address,
            'neighborhood' => $this->neighborhood,
            'city' => $this->city,
            'postalCode' => $this->postalCode,
            'state' => $this->state,
            'brandId' => $this->brandId,
            'brandName' => $this->brandName,
            'phone' => $this->phone,
            'email' => $this->email,
            'lat' => $this->lat,
            'lng' => $this->lng,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
            'deletedAt' => $this->deletedAt,
        ];
    }
}
