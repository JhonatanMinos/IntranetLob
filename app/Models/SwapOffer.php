<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SwapOffer extends Model
{
    protected $fillable = [
        'sender_id',
        'item_offered_id',
        'item_requested_id',
        'status',
    ];

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function itemOffered(): BelongsTo
    {
        return $this->belongsTo(Item::class, 'item_offered_id');
    }

    public function itemRequested(): BelongsTo
    {
        return $this->belongsTo(Item::class, 'item_requested_id');
    }
}
