<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

/**
 * App\Models\Department
 *
 * @description Representa una unidad organizativa o departamento dentro de la empresa.
 * * --- Atributos de la Base de Datos ---
 * @property int $id
 * @property string $name Nombre del departamento (ej: Contabilidad, IT, RRHH).
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * * --- Relaciones ---
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users Colección de usuarios asignados a este departamento.
 * @property-read int|null $users_count
 * * --- Mixins y Herramientas ---
 * @mixin \Illuminate\Database\Eloquent\Builder
 * @mixin \Laravel\Scout\Searchable
 * @method static \Illuminate\Database\Eloquent\Builder|Department query()
 * @method static \Illuminate\Database\Eloquent\Builder|Department search(string $query)
 */
class Department extends Model
{
    /** @use HasFactory<\Database\Factories\DepartmentFactory> */
    use HasFactory;
    use SoftDeletes;
    use Searchable;

    /**
    * $var array <int, string>
    */
    protected $fillable = ['name'];

    /**
    * Configuracion del indice de busqueda para Scout.
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
    * Obtiene los usuarios que pertenecen a este departamento
    *
    * @return HasMany<\App\Models\User, self>
    */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
