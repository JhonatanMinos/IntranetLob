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
        Schema::table('users', function (Blueprint $table) {
            $table->integer('employeeNumber')->after('email_verified_at');
            $table->string('position')->nullable()->after('employeeNumber');
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('store_id')->nullable()->constrained();
            $table->foreignId('company_id')->nullable()->constrained();
            $table->date('birthday')->nullable()->after('store_id');
            $table->date('dateEntry')->nullable()->after('birthday');
            $table->string('phone')->nullable()->after('dateEntry');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('employeeNumber');
            $table->dropColumn('position');
            $table->dropColumn('department_id');
            $table->dropColumn('store_id');
            $table->dropColumn('company_id');
            $table->dropColumn('birthday');
            $table->dropColumn('dateEntry');
            $table->dropColumn('phone');
            $table->softDeletes();
        });
    }
};
