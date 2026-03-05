<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Services\EventService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function __construct(private EventService $eventService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $year = $request->year ? (int) $request->year : null;

        $result = $this->eventService->searchEventsByYear($search, $year);

        return inertia::render('events', [
            'results' => EventResource::collection($result),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Event::class);
        return Inertia::render('Event/create', [
            'types' => Event::typeOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEventRequest $request)
    {
        $this->authorize('create', Event::class);

        $this->eventService->createEvent($request->validated());

        return redirect()->route('events.index')->with('success', 'Evento creado correctamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        $this->authorize('view', $event);
        return Inertia::render('Event/show', [
            'event' => $this->eventService->getEventById($event->id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event)
    {
        $this->authorize('update', $event);
        return Inertia::render('Event/edit', [
            'event' => $this->eventService->getEventById($event->id),
            'types' => Event::typeOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEventRequest $request, Event $event)
    {
        $this->authorize('update', $event);

        $this->eventService->updateEvent($event, $request->validated());

        return back()->with('success', 'Evento actualizado correctamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        $this->authorize('delete', $event);

        $this->eventService->deleteEvent($event);

        return redirect()->route('events.index')->with('success', 'Evento eliminado correctamente');
    }
}
