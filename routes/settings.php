<?php

use App\Http\Controllers\EmployeeFileController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');
    Route::get('employee-files', [EmployeeFileController::class,'index'])->name('employeeFiles.index');
    Route::get('employee-files/{employeeFile}', [EmployeeFileController::class, 'show'])->name('employeeFiles.show');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('settings/payroll', [ProfileController::class, 'payroll'])->name('profile.payroll');
    Route::prefix('settings/employee-files')->group(function () {
        Route::get('/', [EmployeeFileController::class, 'edit'])
            ->name('employeeFiles.edit');
        Route::get('{employeeFile}/document/{type}', [EmployeeFileController::class, 'download'])
            ->name('employeeFiles.download');
        Route::put('{employeeFile}/document', [EmployeeFileController::class, 'updateDocument'])
            ->name('employeeFiles.updateDocument');
        Route::put('{employeeFile}/status', [EmployeeFileController::class, 'updateStatus'])
            ->name('employeeFiles.updateStatus');
    });
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance.edit');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
});

Route::middleware(['auth', 'verified', 'role:sa'])->group(function () {
    Route::get('settings/assignroles', [ProfileController::class, 'assignsRoles'])->name('profile.assign');
    Route::put('settings/assignroles/{user}', [UserController::class, 'assign'])->name('users.assign');

    Route::resource('settings/roles', RoleController::class);
    Route::resource('settings/permissions', PermissionController::class)
        ->only(['store', 'destroy']);
});
