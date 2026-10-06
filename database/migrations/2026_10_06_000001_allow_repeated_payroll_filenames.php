<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payroll_files', function (Blueprint $table) {
            $table->dropUnique(['original_name']);
            $table->index('original_name');
        });
    }

    public function down(): void
    {
        // Si ya hay nombres repetidos, no se deben eliminar recibos para revertir.
        Schema::table('payroll_files', function (Blueprint $table) {
            $table->unique('original_name');
            $table->dropIndex(['original_name']);
        });
    }
};
