<?php

use App\Http\Controllers\StoreController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::redirect('directory', '/directory/users');

    Route::prefix('directory')->group(function () {
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        Route::get('shops', [StoreController::class, 'index'])->name('shops.index');
        Route::post('shops', [StoreController::class, 'store'])->name('shops.store');
        Route::put('shops/{shops}', [StoreController::class, 'update'])->name('shops.update');
        Route::get('corporate', [UserController::class, 'corpo'])->name('users.corpo');
    });
});
