<?php

namespace App\Http\Controllers;

use App\Enums\ItemStatus;
use App\Models\Event;
use App\Models\Item;
use App\Models\Notification;
use App\Models\Store;
use App\Models\User;
use App\Services\ProcessService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GlobalSearchController extends Controller
{
    private const RESULTS_PER_GROUP = 5;

    public function __invoke(Request $request, ProcessService $processService): JsonResponse
    {
        $query = trim($request->validate([
            'q' => ['required', 'string', 'min:2', 'max:80'],
        ])['q']);

        $results = collect();
        $user = $request->user();

        if ($user->can('viewAny', User::class)) {
            $results->push(...$this->users($query));
        }

        if ($user->can('viewAny', Store::class)) {
            $results->push(...$this->stores($query));
        }

        if ($user->can('viewAny', Event::class)) {
            $results->push(...$this->events($query));
        }

        if ($user->can('viewAny', Notification::class)) {
            $results->push(...$this->notifications($query));
        }

        $results->push(...$this->marketplace($query));

        if ($user->can('view-processes')) {
            $results->push(...$processService->searchDocuments($query, self::RESULTS_PER_GROUP));
        }

        return response()->json(['data' => $results->values()]);
    }

    private function users(string $query): array
    {
        return User::query()
            ->with('department:id,name')
            ->where(function ($builder) use ($query) {
                $builder
                    ->whereLike('name', "%{$query}%")
                    ->orWhereLike('email', "%{$query}%")
                    ->orWhereLike('position', "%{$query}%")
                    ->orWhereLike('employeeNumber', "%{$query}%");
            })
            ->limit(self::RESULTS_PER_GROUP)
            ->get()
            ->map(fn (User $user) => [
                'id' => "user-{$user->id}",
                'group' => 'Colaboradores',
                'type' => 'user',
                'title' => $user->name,
                'subtitle' => collect([$user->position, $user->department?->name, $user->email])
                    ->filter()
                    ->join(' · '),
                'url' => route('users.index', ['search' => $user->name]),
            ])
            ->all();
    }

    private function stores(string $query): array
    {
        return Store::query()
            ->with('brand:id,name')
            ->where(function ($builder) use ($query) {
                $builder
                    ->whereLike('name', "%{$query}%")
                    ->orWhereLike('code', "%{$query}%")
                    ->orWhereLike('type', "%{$query}%")
                    ->orWhereLike('city', "%{$query}%")
                    ->orWhereLike('state', "%{$query}%");
            })
            ->limit(self::RESULTS_PER_GROUP)
            ->get()
            ->map(fn (Store $store) => [
                'id' => "store-{$store->id}",
                'group' => 'Tiendas',
                'type' => 'store',
                'title' => $store->name,
                'subtitle' => collect([$store->brand?->name, $store->code, $store->city, $store->state])
                    ->filter()
                    ->join(' · '),
                'url' => route('shops.index', ['search' => $store->name]),
            ])
            ->all();
    }

    private function events(string $query): array
    {
        return Event::query()
            ->where(function ($builder) use ($query) {
                $builder
                    ->whereLike('title', "%{$query}%")
                    ->orWhereLike('type', "%{$query}%");
            })
            ->orderBy('start_date')
            ->limit(self::RESULTS_PER_GROUP)
            ->get()
            ->map(fn (Event $event) => [
                'id' => "event-{$event->id}",
                'group' => 'Eventos',
                'type' => 'event',
                'title' => $event->title,
                'subtitle' => ucfirst(str_replace('_', ' ', $event->type)).' · '.$event->start_date,
                'url' => route('events.index', ['search' => $event->title]),
            ])
            ->all();
    }

    private function notifications(string $query): array
    {
        return Notification::query()
            ->where(function ($builder) use ($query) {
                $builder
                    ->whereLike('title', "%{$query}%")
                    ->orWhereLike('subject', "%{$query}%")
                    ->orWhereLike('type', "%{$query}%");
            })
            ->latest('published_at')
            ->limit(self::RESULTS_PER_GROUP)
            ->get()
            ->map(fn (Notification $notification) => [
                'id' => "notification-{$notification->id}",
                'group' => 'Avisos',
                'type' => 'notification',
                'title' => $notification->title,
                'subtitle' => collect([$notification->subject, ucfirst($notification->type)])
                    ->filter()
                    ->join(' · '),
                'url' => route('notifications.show', $notification),
            ])
            ->all();
    }

    private function marketplace(string $query): array
    {
        return Item::query()
            ->with('category:id,name')
            ->where('status', ItemStatus::Available->value)
            ->where(function ($builder) use ($query) {
                $builder
                    ->whereLike('title', "%{$query}%")
                    ->orWhereLike('description', "%{$query}%");
            })
            ->latest()
            ->limit(self::RESULTS_PER_GROUP)
            ->get()
            ->map(fn (Item $item) => [
                'id' => "item-{$item->id}",
                'group' => 'Marketplace',
                'type' => 'marketplace',
                'title' => $item->title,
                'subtitle' => collect([$item->category?->name, $item->price ? '$'.number_format($item->price, 2) : null])
                    ->filter()
                    ->join(' · '),
                'url' => route('marketplace.index', ['search' => $item->title]),
            ])
            ->all();
    }
}
