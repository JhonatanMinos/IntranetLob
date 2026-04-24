<?php

use App\Models\User;

beforeEach(function () {
    $this->withHeaders(['Accept' => 'application/json']);
    // Si usas Policies, esto saltará las autorizaciones para que el test se centre en la lógica
    $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);
});


it('can list users', function () {
    User::factory()->count(3)->create();

    $response = actingAsAuthenticatedUser()
        ->getJson(route('users.index'));

    $response->assertStatus(200)
        ->assertJsonStructure([
            'props' => [
                'data' => ['data']
            ]
        ]);
});

it('can get user by id', function () {
    $targetUser = User::factory()->create();

    $response = actingAsAuthenticatedUser()
        ->getJson(route('users.show', $targetUser->id));

    $response->assertStatus(200)
        ->assertJsonPath('data.id', $targetUser->id)
        ->assertJsonPath('data.email', $targetUser->email);
});

it('can create user', function () {
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    $userData = [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'employeeNumber' => 'EMP001',
        'position' => 'Developer',
        'department_id' => 1
    ];

    $response = $this->postJson('/api/users', $userData);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'email',
                'employeeNumber',
                'position',
                'departmentId',
                'createdAt',
                'updatedAt'
            ],
            'message'
        ]);

    $this->assertDatabaseHas('users', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'employeeNumber' => 'EMP001'
    ]);
});

it('can update user', function () {
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    $targetUser = User::factory()->create();

    $updateData = [
        'name' => 'Jane Doe Updated',
        'position' => 'Senior Developer'
    ];

    $response = $this->putJson("/api/users/{$targetUser->id}", $updateData);

    $response->assertStatus(200)
        ->assertJson([
            'data' => [
                'id' => $targetUser->id,
                'name' => 'Jane Doe Updated',
                'position' => 'Senior Developer'
            ],
            'message'
        ]);

    $this->assertDatabaseHas('users', [
        'name' => 'Jane Doe Updated',
        'position' => 'Senior Developer'
    ]);
});

it('can delete user', function () {
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    $targetUser = User::factory()->create();

    $response = $this->deleteJson("/api/users/{$targetUser->id}");

    $response->assertStatus(200)
        ->assertJson(['message']);

    $this->assertSoftDeleted($targetUser);
});

it('can search users', function () {
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    User::factory()->create(['name' => 'John Smith']);
    User::factory()->create(['name' => 'Jane Doe']);
    User::factory()->create(['email' => 'test@example.com']);

    $response = $this->getJson('/api/users?search=john');

    $response->assertStatus(200)
        ->assertJsonCount(1, 'data')
        ->assertJson([
            'data' => [
                ['name' => 'John Smith']
            ]
        ]);
});

it('validates required fields when creating user', function () {
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    $response = $this->postJson('/api/users', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'email', 'password']);
});

it('returns 401 when not authenticated', function () {
    $response = $this->getJson('/api/users');

    $response->assertStatus(401);
});

