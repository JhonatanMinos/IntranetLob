<?php

use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

it('requires authentication', function () {
    $this->getJson(route('global-search', ['q' => 'ventas']))
        ->assertUnauthorized();
});

it('validates the minimum query length', function () {
    actingAsAuthenticatedUser();

    $this->getJson(route('global-search', ['q' => 'a']))
        ->assertUnprocessable()
        ->assertJsonValidationErrors('q');
});

it('returns matching results grouped by their source', function () {
    actingAsAuthenticatedUser();

    Event::factory()->create([
        'title' => 'Capacitación de inventario anual',
        'type' => Event::TYPE_EVENT,
        'start_date' => '2026-11-10',
    ]);
    Event::factory()->create(['title' => 'Reunión de cierre']);

    $this->getJson(route('global-search', ['q' => 'inventario']))
        ->assertOk()
        ->assertJsonPath('data.0.group', 'Eventos')
        ->assertJsonPath('data.0.type', 'event')
        ->assertJsonPath('data.0.title', 'Capacitación de inventario anual')
        ->assertJsonCount(1, 'data');
});

it('limits each result group to five entries', function () {
    actingAsAuthenticatedUser();

    Event::factory()->count(7)->create([
        'title' => 'Encuentro comercial',
        'type' => Event::TYPE_EVENT,
    ]);

    $this->getJson(route('global-search', ['q' => 'Encuentro']))
        ->assertOk()
        ->assertJsonCount(5, 'data');
});

it('searches directory data when the user has access', function () {
    actingAsAuthenticatedUser();
    Gate::before(fn () => true);

    User::factory()->create(['name' => 'Mariana Inventarios']);

    $this->getJson(route('global-search', ['q' => 'Mariana']))
        ->assertOk()
        ->assertJsonFragment([
            'group' => 'Colaboradores',
            'type' => 'user',
            'title' => 'Mariana Inventarios',
        ]);
});
