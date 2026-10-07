<?php

use App\Models\User;

it('stores the shortcut selection and order for the authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('dashboard'))
        ->patch(route('dashboard.shortcuts.update'), [
            'shortcuts' => ['events', 'directory', 'marketplace'],
        ])
        ->assertRedirect(route('dashboard'))
        ->assertSessionHas('success');

    expect($user->refresh()->dashboard_shortcuts)->toBe([
        'events',
        'directory',
        'marketplace',
    ]);
});

it('allows a user to hide every shortcut', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('dashboard.shortcuts.update'), ['shortcuts' => []])
        ->assertRedirect();

    expect($user->refresh()->dashboard_shortcuts)->toBe([]);
});

it('rejects unknown or duplicated shortcuts', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('dashboard'))
        ->patch(route('dashboard.shortcuts.update'), [
            'shortcuts' => ['events', 'events', 'unknown'],
        ])
        ->assertRedirect(route('dashboard'))
        ->assertSessionHasErrors(['shortcuts.1', 'shortcuts.2']);

    expect($user->refresh()->dashboard_shortcuts)->toBeNull();
});
