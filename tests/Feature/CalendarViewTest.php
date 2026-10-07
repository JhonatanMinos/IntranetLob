<?php

use App\Models\Event;
use Illuminate\Support\Facades\Gate;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
    Gate::before(fn () => true);
});

it('loads the complete selected year for the calendar alongside the paginated list', function () {
    actingAsAuthenticatedUser();

    Event::factory()->count(2)->create(['start_date' => '2026-05-10']);
    Event::factory()->create(['start_date' => '2025-05-10']);

    $this->get(route('events.index', ['year' => 2026]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('events')
            ->where('selectedYear', 2026)
            ->has('calendarEvents', 2)
            ->has('results.data', 2)
            ->where('can.create', true)
        );
});

it('applies the selected year to every text search condition', function () {
    actingAsAuthenticatedUser();

    Event::factory()->create([
        'title' => 'Convención anual',
        'start_date' => '2026-04-10',
    ]);
    Event::factory()->create([
        'title' => 'Convención anterior',
        'start_date' => '2025-04-10',
    ]);

    $this->getJson(route('events.index', ['year' => 2026, 'search' => 'Convención']))
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.title', 'Convención anual');
});
