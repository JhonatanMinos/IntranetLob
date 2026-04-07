<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

/**
 * App\Models\Company
 *
 * @description Entidad principal que representa a una empresa en el sistema.
 * * --- Atributos de la Base de Datos ---
 * @property int $id
 * @property string $name Nombre legal o comercial de la empresa.
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at Fecha de eliminación (SoftDelete).
 * * --- Relaciones ---
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $user Usuarios asociados a la empresa.
 * @property-read int|null $user_count Conteo total de usuarios.
 * * --- Mixins y Métodos de Búsqueda ---
 * @mixin \Illuminate\Database\Eloquent\Builder
 * @mixin \Laravel\Scout\Searchable
 * @method static \Illuminate\Database\Eloquent\Builder|Company query()
 * @method static \Illuminate\Database\Eloquent\Builder|Company newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Company search(string $query) Realiza una búsqueda mediante Scout.
 */
class Company extends Model
{
    /** @use HasFactory<\Database\Factories\CompanyFactory> */
    use HasFactory;
    use SoftDeletes;
    use Searchable;

    /**
     * Atributos que se pueden asignar masivamente.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name'];

    /**
     * Define la estructura de los datos para el índice de búsqueda (Scout).
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray()
    {
        return [
            'name' => $this->name,
        ];
    }

    /**
     * Obtiene todos los usuarios que pertenecen a esta empresa.
     *
     * @return HasMany<\App\Models\User, self>
     */
    public function user(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
