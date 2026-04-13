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
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('brand_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('code');
            //$table->string('brand');             // marca
            $table->string('type');              // tipo

            $table->string('address');           // direccion
            $table->string('neighborhood');      // colonia
            $table->string('city');              // municipio
            $table->string('postal_code', 10);   // codigo_postal
            $table->string('state');             // estado

            $table->string('phone')->nullable(); // telefono
            $table->string('email')->nullable(); // correo
            $table->decimal('lat', 10, 7)->nullable();
            $table->decimal('lng', 10, 7)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
