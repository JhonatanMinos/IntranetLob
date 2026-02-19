<?php

namespace App\Services;

use App\DTOs\StoreDTO;
use App\Models\Store;

class StoreService
{
    /**
     * Search stores
     */
    public function searchStores(?string $search = null): \Illuminate\Database\Eloquent\Collection
    {
        $query = Store::with('brand');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        return $query->get();
    }

    /**
     * Get all stores with relationships
     */
    public function getAllStores(): \Illuminate\Database\Eloquent\Collection
    {
        return Store::with('brand')->get();
    }

    /**
     * Get a store by ID
     */
    public function getStoreById(int $id): ?StoreDTO
    {
        $store = Store::with('brand')->find($id);
        return $store ? StoreDTO::fromModel($store) : null;
    }

    /**
     * Get stores by brand
     */
    public function getStoresByBrand(int $brandId): \Illuminate\Database\Eloquent\Collection
    {
        return Store::where('brand_id', $brandId)
            ->with('brand')
            ->get();
    }

    /**
     * Get stores by city
     */
    public function getStoresByCity(string $city): \Illuminate\Database\Eloquent\Collection
    {
        return Store::where('city', $city)
            ->with('brand')
            ->get();
    }

    /**
     * Create a new store
     */
    public function createStore(array $data): StoreDTO
    {
        $store = Store::create($data);
        $store->load('brand');
        return StoreDTO::fromModel($store);
    }

    /**
     * Update a store
     */
    public function updateStore(Store $store, array $data): StoreDTO
    {
        $store->update($data);
        $store->load('brand');
        return StoreDTO::fromModel($store);
    }

    /**
     * Delete a store
     */
    public function deleteStore(Store $store): bool
    {
        return $store->delete();
    }

    /**
     * Convert stores collection to DTOs
     */
    public function toStoreDTOs(\Illuminate\Database\Eloquent\Collection $stores): array
    {
        return $stores->map(fn($store) => StoreDTO::fromModel($store))->toArray();
    }
}
