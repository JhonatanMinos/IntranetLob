<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

/**
 * App\Models\EmployeeFile
 *
 * @description Almacena información sensible y documentos adjuntos del expediente de un empleado.
 * * --- Atributos de la Base de Datos ---
 * @property int $id
 * @property string $emergency_contact_name Nombre de la persona de contacto en caso de emergencia.
 * @property string $emergency_contact_phone Teléfono de contacto de emergencia.
 * @property array $documents Arreglo JSON que contiene las rutas o metadatos de los documentos.
 * @property int $user_id ID del usuario (empleado) al que pertenece este expediente.
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * * --- Relaciones ---
 * @property-read \App\Models\User $user El usuario dueño de este expediente.
 * * --- Mixins ---
 * @mixin \Illuminate\Database\Eloquent\Builder
 * @mixin \Laravel\Scout\Searchable
 * @method static \Illuminate\Database\Eloquent\Builder|EmployeeFile query()
 * @method static \Illuminate\Database\Eloquent\Builder|EmployeeFile search(string $query)
 */
class EmployeeFile extends Model
{
    /** @use HasFactory<\Database\Factories\EmployeeFileFactory> */
    use HasFactory;
    use Searchable;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'emergency_contact_name',
        'emergency_contact_phone',
        'documents',
        'user_id',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'documents' => 'array',
    ];

    /**
         * Obtiene el usuario propietario del expediente.
         *
         * @return BelongsTo<\App\Models\User, self>
         */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
