<?php

namespace App\Http\Controllers;

use App\Http\Resources\ItemResource;
use App\Models\Category;
use App\Services\ItemService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarketplaceController extends Controller
{
    public function __construct(
        private ItemService $itemService,
    ) {}

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'category', 'sort', 'payment_type']);

        $items = $this->itemService->getMarketItems($filters);

        $categories = Category::select('id', 'name', 'slug')->get();

        return Inertia::render('marketplaceLOB', [
            'items' => ItemResource::collection($items),
            'categories' => $categories,
            'filters' => $filters,
        ]);
    }
}
