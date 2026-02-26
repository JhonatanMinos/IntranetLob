<?php

namespace App\Services;

use App\DTOs\StoreDTO;
use App\Models\Store;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StoreService
{
    /**
     * Search stores
     */
    public function searchStores(?string $search = null): LengthAwarePaginator
    {
        dd(Store::with('brands')->firstOrFail());
        $query = Store::with('brands')
            ->when($search, function ($q) use ($search) {
                return Store::search($search)
                ->query(fn($q) => $q->with('brands'));
            });
        return $query->paginate(10)->withQueryString();
    }

    /**
     * Get all stores with relationships
     */
    public function getAllStores(): \Illuminate\Database\Eloquent\Collection
    {
        return Store::with('brands')->get();
    }

    /**
     * Get a store by ID
     */
    public function getStoreById(int $id): ?StoreDTO
    {
        $store = Store::with('brands')->find($id);
        return $store ? StoreDTO::fromModel($store) : null;
    }

    /**
     * Get stores by brand
     */
    public function getStoresByBrand(int $brandId): \Illuminate\Database\Eloquent\Collection
    {
        return Store::where('brand_id', $brandId)
            ->with('brands')
            ->get();
    }

    /**
     * Get stores by city
     */
    public function getStoresByCity(string $city): \Illuminate\Database\Eloquent\Collection
    {
        return Store::where('city', $city)
            ->with('brands')
            ->get();
    }

    /**
     * Create a new store
     */
    public function createStore(array $data): StoreDTO
    {
        $store = Store::create($data);
        $store->load('brands');
        return StoreDTO::fromModel($store);
    }

    /**
     * Update a store
     */
    public function updateStore(Store $store, array $data): StoreDTO
    {
        $store->update($data);
        $store->load('brands');
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
