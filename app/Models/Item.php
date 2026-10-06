<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Laravel\Scout\Searchable;

class Item extends Model
{
    use Searchable;

    /**
     * @var array<int, string>
     * */
    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'price',
        'listing_type',
        'status',
    ];

    /**
     * Define los datos indexables para la búsqueda (Scout)
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray()
    {
        return [
            'title' => $this->title,
            'price' => $this->price,
            'category_id' => $this->category_id,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function offersReceived(): HasMany
    {
        return $this->hasMany(SwapOffer::class, 'item_requested_id');
    }

    public function offersMade(): HasMany
    {
        return $this->hasMany(SwapOffer::class, 'item_offered_id');
    }

    public function transaction(): HasOne
    {
        return $this->hasOne(Transaction::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ItemImage::class);
    }

    public function coverImage(): HasOne
    {
        return $this->hasOne(ItemImage::class)->where('is_cover', true);
    }
}
