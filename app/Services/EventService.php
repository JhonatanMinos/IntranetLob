<?php

namespace App\Services;

use App\DTOs\EventDTO;
use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;

class EventService
{
    /**
     * Search events by year
     */
    public function searchEventsByYear(?string $search = null, ?int $year = null): LengthAwarePaginator
    {
        $year ??= Carbon::now()->year;

        $query = Event::when($search, function ($q) use ($search) {
            return $q->where('title', 'like', "%{$search}%")
                ->orWhere('start_date', 'like', "%{$search}%");
        })
        ->whereYear('start_date', $year)
        ->orderBy('start_date');

        return $query->paginate(10)->withQueryString();
    }

    /**
     * Get all events for current month
     */
    public function getCurrentMonthEvents(): \Illuminate\Database\Eloquent\Collection
    {
        $now = Carbon::now();

        return Event::whereMonth('start_date', $now->month)
            ->whereYear('start_date', $now->year)
            ->orderBy('start_date')
            ->get();
    }

    /**
     * Get events for a specific date range
     */
    public function getEventsByDateRange(string $startDate, string $endDate): \Illuminate\Database\Eloquent\Collection
    {
        return Event::whereBetween('start_date', [$startDate, $endDate])
            ->orderBy('start_date')
            ->get();
    }

    /**
     * Get an event by ID
     */
    public function getEventById(int $id): ?EventDTO
    {
        $event = Event::find($id);
        return $event ? EventDTO::fromModel($event) : null;
    }

    /**
     * Create a new event
     */
    public function createEvent(array $data): EventDTO
    {
        $event = Event::create($data);
        return EventDTO::fromModel($event);
    }

    /**
     * Update an event
     */
    public function updateEvent(Event $event, array $data): EventDTO
    {
        $event->update($data);
        return EventDTO::fromModel($event);
    }

    /**
     * Delete an event
     */
    public function deleteEvent(Event $event): bool
    {
        return $event->delete();
    }

    /**
     * Convert events collection to DTOs
     */
    public function toEventDTOs(\Illuminate\Database\Eloquent\Collection $events): array
    {
        return $events->map(fn($event) => EventDTO::fromModel($event))->toArray();
    }
}
