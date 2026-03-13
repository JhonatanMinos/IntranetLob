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
        Schema::create('employee_files', function (Blueprint $table) {
            $table->id();

            $table->string('emergency_contact_name')->nullable()->comment('nombre de conctato de emergencia');
            $table->string('emergency_contact_phone')->nullable()->comment('telefono de emergencia');

            $table->json('documents')->nullable()->comment(json_encode([
                'curp' => [
                    'path'   => 'string',
                    'status' => 'pending|approved|rejected',
                    'note'   => null,
                ],
                'rfc' => [
                    'path'   => 'string',
                    'status' => 'pending|approved|rejected',
                    'note'   => null,
                ],
                'nss' => [
                    'path'   => 'string',
                    'status' => 'pending|approved|rejected',
                    'note'   => null,
                ],
                'birth_certificate' => [
                    'path'   => 'string',
                    'status' => 'pending|approved|rejected',
                    'note'   => null,
                ],
                'ine' => [
                    'path'   => 'string',
                    'status' => 'pending|approved|rejected',
                    'note'   => null,
                ],
                'address_proof' => [
                    'path'   => 'string',
                    'status' => 'pending|approved|rejected',
                    'note'   => null,
                ],
                'education_certificate' => [
                    'path'   => 'string',
                    'status' => 'pending|approved|rejected',
                    'note'   => null,
                ],
                'criminal_record' => [
                    'path'   => 'string',
                    'status' => 'pending|approved|rejected',
                    'note'   => null,
                ],
                'recommendation_letter_1' => [
                    'path'   => 'string',
                    'status' => 'pending|approved|rejected',
                    'note'   => null,
                ],
                'recommendation_letter_2' => [
                    'path'   => 'string',
                    'status' => 'pending|approved|rejected',
                    'note'   => null,
                ],
                'bank_account' => [
                    'path'   => 'string',
                    'status' => 'pending|approved|rejected',
                    'note'   => null,
                ],
                'profile_photo' => [
                    'path'   => 'string',
                    'status' => 'pending|approved|rejected',
                    'note'   => null,
                ],
            ]));

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_files');
    }
};
