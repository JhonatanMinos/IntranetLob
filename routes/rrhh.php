<?php

use App\Http\Controllers\BrandController;
use App\Http\Controllers\PayRollController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\CompanyController;

Route::middleware('auth')->group(
    function () {
        Route::redirect('rrhh', '/rrhh/departament');
        Route::prefix('rrhh')->group(function () {
            Route::get('departament', [DepartmentController::class, 'index'])->name('departament.index');
            Route::post('departament', [DepartmentController::class, 'store'])->name('departament.store');
            Route::delete('departament/{department}', [DepartmentController::class,'destroy'])
                ->name('departament.destroy');
            Route::get('company', [CompanyController::class, 'index'])->name('company.index');
            Route::post('company', [CompanyController::class, 'store'])->name('company.store');
            Route::delete('company/{company}', [CompanyController::class, 'destroy'])->name('company.destroy');
            Route::resource('payroll', PayRollController::class)->except(['edit', 'update']);
            Route::post('payroll/{payroll}/retry', [PayRollController::class, 'retry'])
                ->name('payroll.retry');
            Route::get('payroll/{payroll}/status', [PayRollController::class, 'status'])
                ->name('payroll.status');
            Route::get('payroll/download/{id}', [PayRollController::class, 'download'])->name('payroll.download');
        });
    }
);
