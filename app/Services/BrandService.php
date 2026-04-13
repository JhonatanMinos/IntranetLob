<?php

namespace App\Services;

use App\Models\Brand;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class BrandService
{
    /**
     * Get all brands with caching
     */
    public function getAllBrands(): Collection
    {
        return Cache::remember('brands', 3600, function () {
            return Brand::orderBy('name')->get();
        });
    }

    /**
     * Get brand by ID
     */
    public function getBrandById(int $id): ?Brand
    {
        return Brand::find($id);
    }

    /**
     * Create new brand
     */
    public function createBrand(array $data): Brand
    {
        return Brand::create($data);
    }

    /**
     * Update brand
     */
    public function updateBrand(Brand $brand, array $data): Brand
    {
        $brand->update($data);
        Cache::forget('brands'); // Invalidar cache
        return $brand;
    }

    /**
     * Delete brand
     */
    public function deleteBrand(Brand $brand): bool
    {
        Cache::forget('brands');
        return $brand->delete();
    }
}