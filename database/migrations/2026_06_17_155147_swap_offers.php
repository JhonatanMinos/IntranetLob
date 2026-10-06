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
        Schema::create('swap_offers', function (Blueprint $table) {
            $table->id();

            // Quién propone el intercambio
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');

            // Qué ofrece a cambio (su artículo)
            $table->foreignId('item_offered_id')->constrained('items')->onDelete('cascade');

            // Qué artículo de otra persona está reclamando
            $table->foreignId('item_requested_id')->constrained('items')->onDelete('cascade');

            // Estado de la negociación
            $table->string('status')->default('pending'); // pending, accepted, rejected, canceled

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('swap_offers');
    }
};
