<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\PayRollController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::redirect('rrhh', '/rrhh/departament');
    Route::prefix('rrhh')->group(function () {
        Route::get('departament', [DepartmentController::class, 'index'])->name('departament.index');
        Route::post('departament', [DepartmentController::class, 'store'])->name('departament.store');
        Route::delete('departament/{department}', [DepartmentController::class, 'destroy'])->name(
            'departament.destroy',
        );
        Route::get('company', [CompanyController::class, 'index'])->name('company.index');
        Route::post('company', [CompanyController::class, 'store'])->name('company.store');
        Route::delete('company/{company}', [CompanyController::class, 'destroy'])->name('company.destroy');
        Route::get('payroll/create/{user}', [PayRollController::class, 'create'])->name('payroll.create');
        Route::resource('payroll', PayRollController::class)->except(['create', 'edit', 'update', 'show']);
        Route::get('payroll/download/{id}', [PayRollController::class, 'download'])->name('payroll.download');
    });
});
