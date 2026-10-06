<?php

use App\Models\Store;
use Database\Seeders\RolesSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
    $this->seed(RolesSeeder::class);
});

it('can list stores in the directory', function () {
    $user = createUserWithRole('user');
    $count = Store::count();
    Store::factory()->count(3)->create();
    $this->actingAs($user)->get(route('shops.index'))->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('directory/shops')->has('data.data', $count + 3));
});

it('can search stores by name', function () {
    Store::factory()->create(['name' => 'Sucursal Especial']);
    $this->actingAs(createUserWithRole('user'))->get(route('shops.index', ['search' => 'Sucursal Especial']))->assertOk()
        ->assertInertia(fn (Assert $page) => $page->has('data.data', 1)->where('data.data.0.name', 'Sucursal Especial'));
});

it('rejects unauthenticated store requests', function () {
    $this->getJson(route('shops.index'))->assertUnauthorized();
});

it('rejects employee attempts to create stores', function () {
    $this->actingAs(createUserWithRole('user'))->postJson(route('shops.store'), [])->assertForbidden();
});
