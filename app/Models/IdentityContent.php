<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IdentityContent extends Model
{
    /** @use HasFactory<\Database\Factories\IdentityContentFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'content',
    ];
}
