<?php

use App\Models\Department;
use function Pest\Laravel\{getJson, postJson, actingAs};

beforeEach(function () {
    // Evita que Vite busque archivos inexistentes
    $this->withoutVite();
    Gate::before(fn() => true);
});

it('can list departments', function () {
    // Usando el helper que definimos en Pest.php para ahorrar líneas
    actingAsAuthenticatedUser();

    Department::factory()->count(3)->create();

    $response = $this->getJson(route('departament.index'), [
        'Accept' => 'application/json'
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name']
            ]
        ]);
});

it('can create department', function () {
    actingAsAuthenticatedUser();

    $departmentData = [
        'name' => 'Recursos Humanos',
        'description' => 'Departamento encargado del personal'
    ];
    $response = $this->postJson(route('departament.store'), $departmentData);

    // Si aquí te da 403, revisa el authorize() de tu Request
    $response->assertStatus(201);

    $this->assertDatabaseHas('departments', [
        'name' => 'Recursos Humanos'
    ]);
});

it('validates required fields when creating department', function () {
    actingAsAuthenticatedUser();

    $response = postJson(route('departament.store'), []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name']);
});
