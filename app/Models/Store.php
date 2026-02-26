<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;
use App\Models\Brand;

class Store extends Model
{
    /** @use HasFactory<\Database\Factories\StoreFactory> */
    use HasFactory;
    use SoftDeletes;
    use Searchable;

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

    public function toSearchableArray()
    {
        return [
            'name' => $this->name,
            'code' => $this->code,
            'type' => $this->type,
        ];
    }

    public function brands(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function user()
    {
        return $this->hasMany(User::class);
    }
}
