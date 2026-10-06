<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemRequest;
use App\Http\Resources\ItemResource;
use App\Models\Category;
use App\Models\Item;
use App\Services\ItemService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserItemController extends Controller
{
    public function __construct(
        private ItemService $itemService,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status', 'sort']);
        $myItems = $this->itemService->getItemByUser(auth()->id(), $filters);

        return Inertia::render('Marketplace/MyItems', [
            'items' => ItemResource::collection($myItems),
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Item::class);

        return Inertia::render('Marketplace/Create', ['categories' => Category::orderBy('name')->get(['id', 'name'])]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ItemRequest $request)
    {
        Item::create([...$request->validated(), 'user_id' => $request->user()->id]);

        return to_route('my-items.index')->with('success', 'Publicación creada.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Item $item)
    {
        $this->authorize('update', $item);

        return Inertia::render('Marketplace/Create', ['item' => $item, 'categories' => Category::orderBy('name')->get(['id', 'name'])]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ItemRequest $request, Item $item)
    {
        $item->update($request->validated());

        return to_route('my-items.index')->with('success', 'Publicación actualizada.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        $this->authorize('delete', $item);
        $item->delete();

        return to_route('my-items.index')->with('success', 'Publicación eliminada.');
    }
}
