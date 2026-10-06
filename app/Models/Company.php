<?php

namespace App\Models;

use Database\Factories\CompanyFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Laravel\Scout\Searchable;

/**
 * App\Models\Company
 *
 * @description Entidad principal que representa a una empresa en el sistema.
 * * --- Atributos de la Base de Datos ---
 *
 * @property int $id
 * @property string $name Nombre legal o comercial de la empresa.
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at Fecha de eliminación (SoftDelete).
 *                                   * --- Relaciones ---
 * @property-read Collection<int, User> $user Usuarios asociados a la empresa.
 * @property-read int|null $user_count Conteo total de usuarios.
 * * --- Mixins y Métodos de Búsqueda ---
 *
 * @mixin Builder
 * @mixin Searchable
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Company query()
 * @method static \Illuminate\Database\Eloquent\Builder|Company newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Company search(string $query) Realiza una búsqueda mediante Scout.
 */
class Company extends Model
{
    /** @use HasFactory<CompanyFactory> */
    use HasFactory;

    use Searchable;
    use SoftDeletes;

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
     * @return HasMany<User, self>
     */
    public function user(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
