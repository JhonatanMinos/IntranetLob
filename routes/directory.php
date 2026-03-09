<?php

use App\Http\Controllers\StoreController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::redirect('directory', '/directory/users');

    Route::get('directory/users', [UserController::class, 'index'])->name('users.index');
    Route::post('directory/users', [UserController::class, 'store'])->name('users.store');
    Route::put('directory/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('directory/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('directory/shops', [StoreController::class, 'index'])->name('shops.index');
    Route::post('directory/shops', [StoreController::class, 'store'])->name('shops.store');
    Route::put('directory/shops/{shops}', [StoreController::class, 'update'])->name('shops.update');
});
