<?php

use App\Models\User;
use App\Models\Department;
use App\Services\UserService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user service can search users', function () {
    $department = Department::factory()->create(['name' => 'IT']);
    $user = User::factory()->create([
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'department_id' => $department->id
    ]);

    $userService = app(UserService::class);
    $results = $userService->searchUsers('John');

    expect($results)->toHaveCount(1);
    expect($results->first()->name)->toBe('John Doe');
});

test('user service can get all users with relations', function () {
    $department = Department::factory()->create();
    User::factory()->count(3)->create(['department_id' => $department->id]);

    $userService = app(UserService::class);
    $users = $userService->getAllUsers();

    expect($users)->toHaveCount(3);
    expect($users->first()->department)->not->toBeNull();
});

test('user service can get user by id', function () {
    $department = Department::factory()->create();
    $user = User::factory()->create(['department_id' => $department->id]);

    $userService = app(UserService::class);
    $userDTO = $userService->getUserById($user->id);

    expect($userDTO)->not->toBeNull();
    expect($userDTO->name)->toBe($user->name);
});
