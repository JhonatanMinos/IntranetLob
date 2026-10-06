<?php

namespace App\Services;

use App\Enums\ItemStatus;
use App\Models\Category;
use App\Models\Item;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class ItemService
{
    private const PER_PAGE = 12;

    public function getMarketItems(array $filters): LengthAwarePaginator
    {
        $search = $filters['search'] ?? null;
        $category = $filters['category'] ?? null;          // slug de la categoría
        $paymentType = $filters['payment_type'] ?? null;
        $sort = $filters['sort'] ?? 'newest';

        if ($search) {
            return Item::search($search)
                ->query(function (Builder $q) use ($category, $paymentType, $sort) {
                    $this->applyBaseConstraints($q, $category, $paymentType);
                    $this->applySorting($q, $sort);
                })
                ->paginate(self::PER_PAGE)
                ->withQueryString();
        }

        $query = Item::query();
        $this->applyBaseConstraints($query, $category, $paymentType);
        $this->applySorting($query, $sort);

        return $query->paginate(self::PER_PAGE)->withQueryString();
    }

    public function getCategories(): Collection
    {
        return Category::withCount([
            'items' => fn (Builder $q) => $q->where('status', ItemStatus::Available->value),
        ])
            ->orderBy('name')
            ->get();
    }

    public function getItemById(int $id): Item
    {
        return Item::with(['user', 'category', 'coverImage'])->findOrFail($id);
    }

    private function applyBaseConstraints(
        Builder $q,
        ?string $category,
        ?string $paymentType,
    ): Builder {
        return $q
            ->with(['user', 'category', 'coverImage'])
            ->where('status', ItemStatus::Available->value)
            ->when(
                $category,
                fn (Builder $q) => $q->whereHas(
                    'category',
                    fn (Builder $q) => $q->where('slug', $category),
                ),
            )
            ->when($paymentType === 'money', fn (Builder $q) => $q->whereIn('listing_type', ['sale', 'both']))
            ->when($paymentType === 'swap', fn (Builder $q) => $q->whereIn('listing_type', ['swap', 'both']));
    }

    private function applySorting(Builder $q, string $sort): void
    {
        if (in_array($sort, ['price_asc', 'price_desc'], true)) {
            $direction = $sort === 'price_asc' ? 'ASC' : 'DESC';

            $q->orderByRaw('price IS NULL')->orderBy('price', strtolower($direction));

            return;
        }

        match ($sort) {
            'oldest' => $q->orderBy('created_at'),
            default => $q->orderByDesc('created_at'), // 'newest' y cualquier valor inesperado
        };
    }

    public function getItemByUser(int $userId, array $filters = []): LengthAwarePaginator
    {
        $search = $filters['search'] ?? null;
        $status = $filters['status'] ?? null;
        $sort = $filters['sort'] ?? 'newest';

        if (! empty($search)) {
            return Item::search($search)
                ->query(function ($query) use ($userId, $status, $sort) {
                    $this->applySorting($query, $sort);
                    $query->with(['user', 'category', 'coverImage'])
                        ->where('user_id', $userId)
                        ->when(
                            $status && $status !== 'all',
                            fn ($q) => $q->where('status', $status),
                        );
                })
                ->paginate(self::PER_PAGE)
                ->withQueryString();
        }

        $query = Item::with(['user', 'category', 'coverImage'])
            ->where('user_id', $userId)
            ->when(
                $status && $status !== 'all',
                fn ($q) => $q->where('status', $status),
            );

        match ($sort) {
            'oldest' => $query->orderBy('created_at'),
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            default => $query->orderByDesc('created_at'), // 'newest'
        };

        return $query->paginate(self::PER_PAGE)->withQueryString();
    }
}
