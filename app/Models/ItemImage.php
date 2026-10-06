<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemImage extends Model
{
    protected $fillable = [
        'item_id',
        'path',
        'is_cover',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function casts(): array
    {
        return [
            'is_cover' => 'boolean',
        ];
    }

    public function getUrlAttribute(): string
    {
        return asset('storage/public/marketplace/' . $this->path);
    }
}
