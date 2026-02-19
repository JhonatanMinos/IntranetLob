<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStoreRequest;
use App\Http\Requests\UpdateStoreRequest;
use App\Models\Store;
use App\Services\StoreService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreController extends Controller
{
    public function __construct(private StoreService $storeService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Store::class);

        $search = $request->search;
        $shops = $this->storeService->searchStores($search);

        return Inertia::render('directory/shops', [
            'shops' => $shops,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Store::class);
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStoreRequest $request)
    {
        $this->authorize('create', Store::class);

        $this->storeService->createStore($request->validated());

        return redirect()->route('shops.index')->with('success', 'Tienda creada correctamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(Store $store)
    {
        $this->authorize('view', $store);
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Store $store)
    {
        $this->authorize('update', $store);
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStoreRequest $request, Store $store)
    {
        $this->authorize('update', $store);

        $this->storeService->updateStore($store, $request->validated());

        return back()->with('success', 'Tienda actualizada correctamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Store $store)
    {
        $this->authorize('delete', $store);

        $this->storeService->deleteStore($store);

        return redirect()->route('shops.index')->with('success', 'Tienda eliminada correctamente');
    }
}

