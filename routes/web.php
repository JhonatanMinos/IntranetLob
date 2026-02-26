<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::resource('events', EventController::class)->middleware(['auth', 'verified']);
Route::resource('notifications', NotificationController::class)->middleware(['auth', 'verified']);

Route::get('/services', function () {
    return Inertia::render('services');
})->name('services');

Route::get('/processes', function () {
    return Inertia::render('processes');
})->name('processes');


require __DIR__ . '/settings.php';
require __DIR__ . '/directory.php';
