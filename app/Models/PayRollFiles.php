<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\PayRollFiles
 *
 * @description Representa un archivo físico asociado a un registro de nómina.
 * * --- Atributos de la Base de Datos ---
 * @property int $id
 * @property int $payroll_id ID de la nómina relacionada.
 * @property string $file_path Ruta de almacenamiento del archivo.
 * @property string $original_name Nombre original del archivo al subirlo.
 * @property string|null $mime_type Tipo de contenido (ej: application/pdf).
 * @property int|null $file_size Tamaño en bytes.
 * @property int|null $employee_id ID del usuario/empleado asociado.
 * @property string $status Estado del procesamiento (ej: pending, completed, error).
 * @property string|null $error_message Detalle de error si el procesamiento falla.
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * * --- Relaciones ---
 * @property-read \App\Models\PayRoll $upload El registro de nómina padre.
 * @property-read \App\Models\User|null $employee El empleado dueño del archivo.
 */

class PayRollFiles extends Model
{
    /**
     * Los atributos que son asignables en masa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'payroll_id',
        'file_path',
        'original_name',
        'mime_type',
        'file_size',
        'employee_id',
        'status',
        'error_message',
    ];

    /**
     * Obtiene el registro de nómina al que pertenece este archivo.
     *
     * @return BelongsTo<\App\Models\PayRoll, self>
     */
    public function upload(): BelongsTo
    {
        return $this->belongsTo(PayRoll::class, 'payroll_id');
    }


    /**
     * Obtiene el empleado (Usuario) asociado al archivo.
     *
     * @return BelongsTo<\App\Models\User, self>
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'employee_id');
    }
}
