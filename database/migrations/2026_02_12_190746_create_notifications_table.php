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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subject')->nullable()->comment('Asunto para los avisos');
            $table->longText('content')->comment('Contenido que se mostrara en los 4 tipos');
            $table->string('imagen_path')->nullable()->comment('Imagen que puede ser un diseno');
            $table->string('priority')->default('normal')->comment('La prioridad que se enviara la notificacion');
            $table->string('type')->comment('El tipo de notificacion');
            $table->foreignId('created_by')->constrained('users')->cascadeOnUpdate();
            $table->timestamp('published_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
