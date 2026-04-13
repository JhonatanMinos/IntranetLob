<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProcessController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::get('dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');
Route::patch('notifications/{id}/read', function (string $id) {
    auth()->user()->notifications()->findOrFail($id)->markAsRead();
    return back();
})->middleware('auth')->name('notifications.read');

Route::middleware(['auth'])->group(function () {
    Route::resource('events', EventController::class);
    Route::resource('notifications', NotificationController::class);
    Route::resource('processes', ProcessController::class);
    Route::post('processes/upload', [ProcessController::class, 'upload']);
    Route::delete('processes/delete', [ProcessController::class, 'delete']);
});


require __DIR__ . '/settings.php';
require __DIR__ . '/directory.php';
require __DIR__ . '/rrhh.php';
