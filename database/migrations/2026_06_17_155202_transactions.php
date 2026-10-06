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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            // El artículo principal de la publicación
            $table->foreignId('item_id')->constrained()->onDelete('cascade');

            // Participantes
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');

            // Si la transacción nació de un intercambio, se vincula aquí
            $table->foreignId('swap_offer_id')->nullable()->constrained('swap_offers')->onDelete('set null');

            // Detalles de cierre
            $table->string('type'); // sale, swap
            $table->decimal('final_price', 10, 2)->default(0.00); // 0 si es swap puro

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
