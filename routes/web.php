<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProcessController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::get('dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::resource('events', EventController::class)->middleware(['auth', 'verified']);
Route::resource('notifications', NotificationController::class)->middleware(['auth', 'verified']);
Route::resource('processes', ProcessController::class)->middleware(['auth','verified']);

Route::get('/services', function () {
    return Inertia::render('services');
})->name('services');

require __DIR__ . '/settings.php';
require __DIR__ . '/directory.php';
