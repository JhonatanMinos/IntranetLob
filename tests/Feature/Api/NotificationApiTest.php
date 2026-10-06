<?php

use App\Models\Notification;
use Database\Seeders\RolesSeeder;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
    $this->seed(RolesSeeder::class);
});

it('can list notifications', function () {
    Notification::factory()->count(3)->create();
    $this->actingAs(createUserWithRole('user'))->get(route('notifications.index'))->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('notifications')->has('data.data', 3));
});

it('can create a sanitized notification as HR', function () {
    $data = ['title' => 'Nueva política', 'subject' => 'Aviso', 'content' => '<p>Contenido</p><script>alert(1)</script>',
        'type' => 'aviso', 'priority' => 'importante', 'published_at' => now()->toDateTimeString()];
    $this->actingAs(createUserWithRole('rh'))->post(route('notifications.store'), $data)->assertSessionHasNoErrors()
        ->assertRedirect(route('notifications.index'));
    $notification = Notification::where('title', 'Nueva política')->firstOrFail();
    expect($notification->getRawOriginal('content'))->not->toContain('<script')->toContain('<p>Contenido</p>');
});

it('marks only the users own system notification as read', function () {
    $user = createUserWithRole('user');
    $notice = $user->notifications()->create(['id' => (string) Str::uuid(), 'type' => 'test', 'data' => ['message' => 'Aviso']]);
    $this->actingAs($user)->patch(route('notifications.read', $notice->id))->assertRedirect();
    expect($notice->refresh()->read_at)->not->toBeNull();
    $this->actingAs(createUserWithRole('user'))->patch(route('notifications.read', $notice->id))->assertNotFound();
});

it('validates required fields when creating notification', function () {
    $this->actingAs(createUserWithRole('rh'))->postJson(route('notifications.store'), [])->assertUnprocessable()
        ->assertJsonValidationErrors(['title', 'subject', 'type', 'priority', 'published_at']);
});
