<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Brand
 * * @description Gestiona las marcas comerciales que agrupan a las tiendas (Stores).
 * * --- Atributos de la Base de Datos ---
 * @property int $id
 * @property string $name Nombre comercial de la marca.
 * @property string $slug Identificador amigable para URLs (único).
 * @property string|null $description Breve reseña o descripción de la marca.
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at Fecha de eliminación lógica.
 * * --- Relaciones ---
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Store> $store Colección de tiendas asociadas.
 * @property-read int|null $store_count Conteo automático de tiendas (si se usa withCount).
 * * --- Mixins (Para SoftDeletes y Factories) ---
 * @mixin \Illuminate\Database\Eloquent\Builder
 * @method static \Illuminate\Database\Eloquent\Builder|Brand newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Brand newQuery()
 * @method static \Illuminate\Database\Query\Builder|Brand onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Brand query()
 * @method static \Illuminate\Database\Query\Builder|Brand withTrashed()
 * @method static \Illuminate\Database\Query\Builder|Brand withoutTrashed()
 */
class Brand extends Model
{
    /** @use HasFactory<\Database\Factories\BrandFactory> */
    use HasFactory;
    use SoftDeletes;

    /**
     * Atributos asignables en masa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    /**
     * Define la relación de uno a muchos con las tiendas.
     * * @return HasMany<\App\Models\Store, self>
     */
    public function store(): HasMany
    {
        return $this->hasMany(Store::class);
    }
}
