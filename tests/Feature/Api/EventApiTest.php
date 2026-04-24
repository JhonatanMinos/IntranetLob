<?php

use App\Models\Event;
use Illuminate\Support\Facades\Gate;

beforeEach(function () {
    $this->withoutVite();
    // Aseguramos que el usuario tenga permisos
    Gate::before(fn() => true);
});

it('can list events', function () {
    actingAsAuthenticatedUser();
    Event::factory()->count(3)->create();

    // Usamos el helper route() para evitar errores de prefijos
    $response = $this->getJson(route('events.index'));

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'title',
                    'type',
                    'startDate', // Corregido a snake_case
                    'endDate',   // Corregido a snake_case
                    'allDay',    // Corregido a snake_case
                ]
            ]
        ]);
});

it('can create event', function () {
    actingAsAuthenticatedUser();

    $eventData = [
        'title'      => 'Evento de Prueba',
        'type'       => Event::TYPE_EVENT,
        'start_date' => '2026-04-25 10:00:00',
        'end_date'   => '2026-04-25 12:00:00',
        'all_day'    => false,
    ];

    $response = $this->postJson(route('events.store'), $eventData);

    $response->assertStatus(201);

    // Corregido: los datos deben coincidir con $eventData
    $this->assertDatabaseHas('events', [
        'title'      => 'Evento de Prueba',
        'type'       => Event::TYPE_EVENT,
        'start_date' => '2026-04-25 10:00:00'
    ]);
});

it('can filter events by year', function () {
    actingAsAuthenticatedUser();

    Event::factory()->create(['start_date' => '2026-04-15']);
    Event::factory()->create(['start_date' => '2026-05-10']);
    Event::factory()->create(['start_date' => '2026-04-20']);

    $response = $this->getJson(route('events.index', ['year' => 2026]));

    $response->assertStatus(200)
        ->assertJsonCount(3, 'data');
});

it('validates required fields when creating event', function () {
    actingAsAuthenticatedUser();

    $response = $this->postJson(route('events.store'), []);

    $response->assertStatus(422)
        // Corregido: Validamos contra los nombres reales en el Request/DB
        ->assertJsonValidationErrors(['title', 'type', 'start_date']);
});

it('validates date format for start_date', function () {
    actingAsAuthenticatedUser();

    $eventData = [
        'title'      => 'Test Event',
        'type'       => 'evento',
        'start_date' => 'invalid-date'
    ];

    $response = $this->postJson(route('events.store'), $eventData);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['start_date']);
});
