<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Índices en users para búsquedas y relaciones
        Schema::table('users', function (Blueprint $table) {
            $table->index('name');
            $table->index('email');
            $table->index('department_id');
            $table->index('company_id');
            $table->index('store_id');
            $table->index('created_at');
        });

        // Índices en brands
        Schema::table('brands', function (Blueprint $table) {
            $table->index('name');
        });

        // Índices en departments
        if (Schema::hasTable('departments')) {
            Schema::table('departments', function (Blueprint $table) {
                $table->index('name');
                $table->index('created_at');
            });
        }

        // Índices en companies
        Schema::table('companies', function (Blueprint $table) {
            $table->index('name');
        });

        // Índices en stores para búsquedas
        Schema::table('stores', function (Blueprint $table) {
            $table->index('name');
            $table->index('code');
            $table->index('city');
            $table->index('brand_id');
        });

        // Índices en notifications
        Schema::table('notifications', function (Blueprint $table) {
            $table->index('title');
            $table->index('created_by');
            $table->index('published_at');
            $table->index('created_at');
        });

        // Índices en events
        Schema::table('events', function (Blueprint $table) {
            $table->index('title');
            $table->index('start_date');
            $table->index('type');
        });

        // Índice en identity_contents
        if (Schema::hasTable('identity_contents')) {
            Schema::table('identity_contents', function (Blueprint $table) {
                $table->index('name');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['name']);
            $table->dropIndex(['email']);
            $table->dropIndex(['department_id']);
            $table->dropIndex(['company_id']);
            $table->dropIndex(['store_id']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('brands', function (Blueprint $table) {
            $table->dropIndex(['name']);
        });

        if (Schema::hasTable('departments')) {
            Schema::table('departments', function (Blueprint $table) {
                $table->dropIndex(['name']);
                $table->dropIndex(['created_at']);
            });
        }

        Schema::table('companies', function (Blueprint $table) {
            $table->dropIndex(['name']);
        });

        Schema::table('stores', function (Blueprint $table) {
            $table->dropIndex(['name']);
            $table->dropIndex(['code']);
            $table->dropIndex(['city']);
            $table->dropIndex(['brand_id']);
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex(['title']);
            $table->dropIndex(['created_by']);
            $table->dropIndex(['published_at']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex(['title']);
            $table->dropIndex(['start_date']);
            $table->dropIndex(['type']);
        });

        if (Schema::hasTable('identity_contents')) {
            Schema::table('identity_contents', function (Blueprint $table) {
                $table->dropIndex(['name']);
            });
        }
    }
};
