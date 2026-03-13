<?php

namespace App\Services;

use App\Models\EmployeeFile;
use Illuminate\Support\Facades\Storage;
use App\Notifications\DocumentRejected;

class EmployeeFileService
{
    protected array $defaultDocuments;

    public function __construct()
    {
        $this->defaultDocuments = collect([
            'curp', 'rfc', 'nss',
            'birth_certificate', 'ine', 'address_proof',
            'education_certificate', 'criminal_record', 'recommendation_letter_1',
            'recommendation_letter_2', 'bank_account', 'profile_photo',
        ])->mapWithKeys(fn($doc) => [
            $doc => ['path' => null, 'status' => 'pending', 'note' => null],
        ])->toArray();
    }

    /**
     * Paginate the employee files, optionally applying a search term.
     */
    public function paginate(?string $search, int $perPage = 10)
    {
        $query = EmployeeFile::with('user');
        if ($search) {
            $query = EmployeeFile::search($search);
        }

        return $query->paginate($perPage);
    }

    /**
     * Ensure an employee file exists for the given user and has default documents.
     */
    public function ensureForUser($user): EmployeeFile
    {
        $employeeFile = EmployeeFile::firstOrNew(['user_id' => $user->id]);
        if (! $employeeFile->exists || empty($employeeFile->documents)) {
            $employeeFile->documents = $this->defaultDocuments;
            $employeeFile->save();
        }

        return $employeeFile;
    }

    /**
     * Update the status of a given document type, notify on rejection.
     */
    public function updateStatus(EmployeeFile $employeeFile, string $type, string $status, string $note = ''): void
    {
        if ($status === 'rejected') {
            $documentLabels = [
                'curp'                   => 'CURP',
                'rfc'                    => 'RFC',
                'nss'                    => 'Número de Seguro Social',
                'birth_certificate'      => 'Acta de Nacimiento',
                'ine'                    => 'INE / Identificación Oficial',
                'address_proof'          => 'Comprobante de Domicilio',
                'education_certificate'  => 'Certificado de Estudios',
                'criminal_record'        => 'Antecedentes No Penales',
                'recommendation_letter_1' => 'Carta de Recomendación 1',
                'recommendation_letter_2' => 'Carta de Recomendación 2',
                'bank_account'           => 'Cuenta Bancaria',
                'profile_photo'          => 'Foto de Perfil',
            ];

            $label   = $documentLabels[$type] ?? $type;
            $message = "Tu documento '{$label}' fue rechazado.";
            $note ??= 'Sin motivo especificado';
            $notifType = 'file';
            $employeeFile->user->notify(new DocumentRejected($notifType, $message, $note));
        }

        $documents = $employeeFile->documents ?? [];
        $documents[$type] = array_merge(
            $documents[$type] ?? [],
            ['status' => $status]
        );

        $employeeFile->update(['documents' => $documents]);
    }

    /**
     * Handle uploading/updating a single document file.
     */
    public function updateDocument(EmployeeFile $employeeFile, string $type, $uploadedFile): void
    {
        $documents = $employeeFile->documents ?? [];
        if (isset($documents[$type]['path'])) {
            Storage::delete($documents[$type]['path']);
        }

        $path = $uploadedFile->storeAs(
            "employee-files/{$employeeFile->user_id}",
            "{$type}.{$uploadedFile->extension()}"
        );

        $documents[$type] = [
            'path'   => $path,
            'status' => 'pending',
            'note'   => null,
        ];

        $employeeFile->update(['documents' => $documents]);
    }

    /**
     * Return a storage response for downloading a document.
     */
    public function downloadResponse(EmployeeFile $employeeFile, string $type)
    {
        $path = $employeeFile->documents[$type]['path'] ?? null;
        abort_if(!$path || !Storage::exists($path), 404);

        return Storage::response($path);
    }
}
