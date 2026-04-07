<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;
use App\Models\Brand;

/**
 * App\Models\Store
 *
 * @description Representa una sucursal física o punto de venta asociado a una marca.
 * * --- Atributos de la Base de Datos ---
 * @property int $id
 * @property string $name Nombre de la tienda.
 * @property string $code Código identificador único de la sucursal.
 * @property int $brand_id ID de la marca (Brand) a la que pertenece.
 * @property string|null $type Categoría o tipo de tienda.
 * @property string|null $address Dirección de la calle y número.
 * @property string|null $neighborhood Colonia o sector.
 * @property string|null $city Ciudad.
 * @property string|null $postal_code Código postal.
 * @property string|null $state Estado o provincia.
 * @property string|null $phone Teléfono de contacto de la sucursal.
 * @property string|null $email Correo electrónico de la sucursal.
 * @property float|null $lat Latitud geográfica.
 * @property float|null $lng Longitud geográfica.
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * * --- Relaciones ---
 * @property-read \App\Models\Brand $brand La marca propietaria de la tienda.
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $user Usuarios asignados a esta tienda.
 * @property-read int|null $user_count
 * * --- Mixins ---
 * @mixin \Illuminate\Database\Eloquent\Builder
 * @mixin \Laravel\Scout\Searchable
 * @method static \Illuminate\Database\Eloquent\Builder|Store query()
 * @method static \Illuminate\Database\Eloquent\Builder|Store search(string $query)
 */
class Store extends Model
{
    /** @use HasFactory<\Database\Factories\StoreFactory> */
    use HasFactory;
    use SoftDeletes;
    use Searchable;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'code',
        'brand_id',
        'type',
        'address',
        'neighborhood',
        'city',
        'postal_code',
        'state',
        'phone',
        'email',
        'lat',
        'lng',
    ];

    /**
     * Define los datos indexables para la búsqueda (Scout).
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray()
    {
        return [
            'name' => $this->name,
            'code' => $this->code,
            'type' => $this->type,
        ];
    }

    /**
     * Obtiene la marca a la que pertenece la tienda.
     *
     * @return BelongsTo<\App\Models\Brand, self>
     */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Obtiene los usuarios vinculados a esta sucursal.
     *
     * @return HasMany<\App\Models\User, self>
     */
    public function user(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
