<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            // Llaves foráneas
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');

            // Datos del artículo
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 10, 2)->nullable(); // Nullable si es solo trueque

            // Índices para tipos y estados (Optimiza búsquedas en la intranet)
            $table->string('listing_type')->default('sale'); // sale, swap, both
            $table->string('status')->default('available'); // available, sold, swapped, inactive

            $table->timestamps();

            // Índices compuestos si planeas filtrar mucho por tipo/estado
            $table->index(['listing_type', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
