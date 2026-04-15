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
        Schema::create('payroll_files', function (Blueprint $table) {
            $table->id();

            // Datos del archivo extraído
            $table->string('file_path');
            $table->string('original_name');
            $table->string('mime_type');
            $table->unsignedBigInteger('file_size');  // bytes
            $table->foreignIdFor(User::class)
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            //$table->string('status')->default('pending');
            $table->boolean('processed')->default(false);

            $table->text('error_message')->nullable();
            $table->timestamps();

            //$table->index(['payroll_id', 'status']);

            $table->unique(['original_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payroll_files');
    }
};
