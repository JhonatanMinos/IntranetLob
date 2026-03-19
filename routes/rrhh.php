<?php

use App\Http\Controllers\BrandController;
use App\Models\Company;
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
        });
    }
);
