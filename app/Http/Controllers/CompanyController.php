<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;

        if ($search) {
            $data = Company::search($search)
                ->query(fn($q) => $q->with('user'))
                ->orderBy('name')
                ->paginate(10);
            $data->appends(request()->query());
        } else {
            $data = Company::with('user')
                ->orderBy('name')
                ->paginate(10)
                ->withQueryString();
        }

        return Inertia::render('rrhh/company', [
            'data'   => CompanyResource::collection($data),
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCompanyRequest $request)
    {
        $this->authorize('create', Company::class);

        $query = Company::create([
            'name' => $request->name,
        ]);

        return back()->with('success', 'Compania creada con exito');
    }

    /**
     * Display the specified resource.
     */
    public function show(Company $company)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Company $company)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCompanyRequest $request, Company $company)
    {
        $this->authorize('update', $company);

        $company->update([
            'name' => $request->name,
        ]);

        return back()->with('success', 'Compañía actualizada correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company)
    {
        $this->authorize('delete', $company);
        $company->delete();
        return back()->with('success', 'Compania elimidada correctamente');
    }
}
