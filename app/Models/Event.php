<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    /** @use HasFactory<\Database\Factories\EventFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'type',
        'start_date',
        'end_date',
        'all_day'
    ];

    public const TYPE_CUMPLE = 'cumpleanos';
    public const TYPE_FESTIVO = 'festivo';
    public const TYPE_CAMPANIA = 'campania';
    public const TYPE_LANZAMIENTO = 'lanzamiento';
    public const TYPE_EVENT = 'evento';
}
