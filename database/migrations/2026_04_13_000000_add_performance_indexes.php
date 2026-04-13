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
        // Índices para users
        Schema::table('users', function (Blueprint $table) {
            $table->index(['department_id', 'company_id', 'store_id'], 'users_relations_index');
            $table->index('email');
            $table->index('employee_number');
            $table->index('birthday');
        });

        // Índices para notifications
        Schema::table('notifications', function (Blueprint $table) {
            $table->index(['created_by', 'published_at'], 'notifications_creator_published_index');
            $table->index('priority');
            $table->index('type');
        });

        // Índices para events
        Schema::table('events', function (Blueprint $table) {
            $table->index(['start_date', 'end_date'], 'events_date_range_index');
            $table->index('created_by');
        });

        // Índices para pay_rolls
        Schema::table('pay_rolls', function (Blueprint $table) {
            $table->index(['user_id', 'period'], 'pay_rolls_user_period_index');
            $table->index('processed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('users_relations_index');
            $table->dropIndex(['email']);
            $table->dropIndex(['employee_number']);
            $table->dropIndex(['birthday']);
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex('notifications_creator_published_index');
            $table->dropIndex(['priority']);
            $table->dropIndex(['type']);
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex('events_date_range_index');
            $table->dropIndex(['created_by']);
        });

        Schema::table('pay_rolls', function (Blueprint $table) {
            $table->dropIndex('pay_rolls_user_period_index');
            $table->dropIndex(['processed_at']);
        });
    }
};

