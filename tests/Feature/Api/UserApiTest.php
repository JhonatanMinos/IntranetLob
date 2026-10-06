<?php

use App\Models\User;
use Database\Seeders\RolesSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
    $this->seed(RolesSeeder::class);
});

it('can list users in the directory', function () {
    $user = createUserWithRole('user');
    $this->actingAs($user)->get(route('users.index'))->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('directory/users')->has('data.data', 1));
});

it('can create user as administrator', function () {
    $admin = createUserWithRole('sa');
    $template = User::factory()->make();
    $data = $template->only(['name', 'email', 'position', 'birthday', 'dateEntry', 'phone', 'department_id', 'company_id', 'store_id']);
    $data['employeeNumber'] = (string) $template->employeeNumber;
    $data['password'] = 'password123';
    $this->actingAs($admin)->post(route('users.store'), $data)->assertSessionHasNoErrors()->assertRedirect(route('users.index'));
    $this->assertDatabaseHas('users', ['email' => $template->email]);
    expect(User::where('email', $template->email)->first()->hasRole('user'))->toBeTrue();
});

it('can update user as administrator', function () {
    $target = User::factory()->create(['employeeNumber' => 34567]);
    $data = $target->only(['employeeNumber', 'email', 'position', 'birthday', 'dateEntry', 'phone', 'department_id', 'company_id', 'store_id']);
    $data['name'] = 'Nombre actualizado';
    $this->actingAs(createUserWithRole('sa'))->put(route('users.update', $target), $data)->assertSessionHasNoErrors()->assertRedirect();
    expect($target->refresh()->name)->toBe('Nombre actualizado');
});

it('can soft delete user as administrator', function () {
    $target = User::factory()->create();
    $this->actingAs(createUserWithRole('sa'))->delete(route('users.destroy', $target))->assertRedirect(route('users.index'));
    $this->assertSoftDeleted($target);
});

it('can search users', function () {
    User::factory()->create(['name' => 'John Smith']);
    $this->actingAs(createUserWithRole('user'))->get(route('users.index', ['search' => 'John Smith']))->assertOk()
        ->assertInertia(fn (Assert $page) => $page->has('data.data', 1)->where('data.data.0.name', 'John Smith'));
});

it('validates required fields when creating user', function () {
    $this->actingAs(createUserWithRole('sa'))->postJson(route('users.store'), [])->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'email', 'password']);
});

it('rejects unauthenticated directory requests', function () {
    $this->getJson(route('users.index'))->assertUnauthorized();
});

it('rejects employee attempts to create users', function () {
    $template = User::factory()->make();
    $data = $template->only(['name', 'email', 'position', 'birthday', 'dateEntry', 'phone', 'department_id', 'company_id', 'store_id']);
    $data['employeeNumber'] = (string) $template->employeeNumber;
    $data['password'] = 'password123';
    $this->actingAs(createUserWithRole('user'))->postJson(route('users.store'), $data)->assertForbidden();
});
