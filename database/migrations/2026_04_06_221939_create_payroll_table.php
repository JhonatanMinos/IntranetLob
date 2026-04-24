<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->restrictOnDelete()->comment('Quien subio el archivo');
            $table->date('period_start')->comment('Periodo de inicio de la nomina');
            $table->date('period_end')->comment('Periodo final de la nomina');
            $table->string('period_type')->default('quincenal')->comment('Tipo de nomina');

            $table->string('zip_path')->comment('storage path');
            $table->string('zip_original_name')->comment('nombre original dle ZIP');
            $table->unsignedInteger('zip_size')->comment('bytes');

            $table->string('status')->default('pedding')->comment('Estado del procesamiento');
            $table->text('error_menssage')->nullable();
            $table->unsignedInteger('total_files')->default(0)->comment('Total de archivos');
            $table->unsignedInteger('processd_files')->default(0)->comment('archivos procesados');

            $table->softDeletes();
            $table->timestamps();

            $table->index(['status', 'period_start']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payroll');
    }
};
