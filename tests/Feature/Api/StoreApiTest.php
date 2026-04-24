<?php

use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

it('can list stores', function () {
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    Store::factory()->count(3)->create();

    $response = $this->getJson('/api/stores');

    $response->assertStatus(200)
             ->assertJsonStructure([
                 'data' => [
                     '*' => [
                         'id', 'name', 'code', 'type', 'address', 'city',
                         'brandId', 'brandName', 'lat', 'lng', 'createdAt', 'updatedAt'
                     ]
                 ],
                 'links', 'meta'
             ]);
});

it('can create store', function () {
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    $storeData = [
        'name' => 'Nueva Tienda',
        'code' => 'NT001',
        'type' => 'sucursal',
        'address' => 'Calle Principal 123',
        'city' => 'Madrid',
        'brand_id' => 1,
        'lat' => 40.4168,
        'lng' => -3.7038
    ];

    $response = $this->postJson('/api/stores', $storeData);

    $response->assertStatus(201)
             ->assertJsonStructure([
                 'data' => [
                     'id', 'name', 'code', 'type', 'address', 'city',
                     'brandId', 'lat', 'lng', 'createdAt'
                 ],
                 'message'
             ]);

    $this->assertDatabaseHas('stores', [
        'name' => 'Nueva Tienda',
        'code' => 'NT001',
        'city' => 'Madrid'
    ]);
});

it('can filter stores by city', function () {
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    Store::factory()->create(['city' => 'Madrid']);
    Store::factory()->create(['city' => 'Barcelona']);
    Store::factory()->create(['city' => 'Madrid']);

    $response = $this->getJson('/api/stores?city=Madrid');

    $response->assertStatus(200)
             ->assertJsonCount(2, 'data');
});

it('can search stores by name', function () {
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    Store::factory()->create(['name' => 'Tienda Central']);
    Store::factory()->create(['name' => 'Sucursal Norte']);
    Store::factory()->create(['name' => 'Centro Comercial']);

    $response = $this->getJson('/api/stores?search=central');

    $response->assertStatus(200)
             ->assertJsonCount(1, 'data')
             ->assertJson([
                 'data' => [
                     ['name' => 'Tienda Central']
                 ]
             ]);
});

it('validates required fields when creating store', function () {
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    $response = $this->postJson('/api/stores', []);

    $response->assertStatus(422)
             ->assertJsonValidationErrors(['name', 'code', 'city']);
});