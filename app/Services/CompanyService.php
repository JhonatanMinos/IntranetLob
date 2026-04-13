<?php

namespace App\Services;

use App\Models\Company;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class CompanyService
{
    /**
     * Get all companies with caching
     */
    public function getAllCompanies(): Collection
    {
        return Cache::remember('companies', 3600, function () {
            return Company::with('brand')->orderBy('name')->get();
        });
    }

    /**
     * Get company by ID with relations
     */
    public function getCompanyById(int $id): ?Company
    {
        return Company::with('brand', 'stores')->find($id);
    }

    /**
     * Create new company
     */
    public function createCompany(array $data): Company
    {
        $company = Company::create($data);
        Cache::forget('companies');
        return $company;
    }

    /**
     * Update company
     */
    public function updateCompany(Company $company, array $data): Company
    {
        $company->update($data);
        Cache::forget('companies');
        return $company;
    }

    /**
     * Delete company
     */
    public function deleteCompany(Company $company): bool
    {
        Cache::forget('companies');
        return $company->delete();
    }
}