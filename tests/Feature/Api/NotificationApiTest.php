<?php

use App\Models\Notification;

beforeEach(function () {
    // Evita que Vite busque archivos inexistentes
    $this->withoutVite();
    Gate::before(fn() => true);
});

it('can list notifications', function () {
    actingAsAuthenticatedUser();
    Notification::factory()->count(3)->create();

    $response = test()->getJson(route('notifications.index'));
    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'title',
                    'subject',
                    'content',
                    'priority',
                    'type',
                    'createdBy',
                    'publishedAt',
                    'createdAt',
                    'updatedAt'
                ]
            ],
            'links',
            'meta'
        ]);
});

it('can create notification', function () {
    $notificationData = [
        'title'    => 'Test',
        'subject'  => 'Sub',
        'content'  => 'Contenido',
        'type'     => Notification::TYPE_AVISO,
        'priority' => Notification::PRIORITY_IMPORTANT,
        'published_at' => now()->toDateTimeString(),
    ];

    $response = actingAsAuthenticatedUser()
        ->postJson(route('notifications.store'), $notificationData);

    $response->assertStatus(201);
    $response->assertJsonPath('data.title', 'Nueva política de trabajo');
    // Y verificamos que los datos estén en la BD
    $this->assertDatabaseHas('notifications', [
        'title' => 'Nueva política de trabajo'
    ]);
});

it('can publish notification', function () {
    $notification = Notification::factory()->create(['published_at' => null]);

    // Error 404 solucionado: la ruta es notifications.read y requiere el parámetro {id}
    $response = actingAsAuthenticatedUser()
        ->patchJson(route('notifications.read', ['id' => $notification->id]));

    $response->assertStatus(200);
});

it('validates required fields when creating notification', function () {
    actingAsAuthenticatedUser();
    $response = $this->postJson('/api/notifications', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['title', 'content', 'type', 'priority']);
});
