<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    /** @use HasFactory<\Database\Factories\EventFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'id',
        'title',
        'type',
        'start_date',
        'end_date',
        'all_day',
    ];

    public const TYPE_CUMPLE = 'cumpleanos';
    public const TYPE_FESTIVO = 'festivo';
    public const TYPE_CAMPANIA = 'campania';
    public const TYPE_LANZAMIENTO = 'lanzamiento';
    public const TYPE_EVENT = 'evento';

    /**
     * Get available event type options
     */
    public static function typeOptions(): array
    {
        return [
            ['value' => self::TYPE_CUMPLE, 'label' => 'Cumpleaños'],
            ['value' => self::TYPE_FESTIVO, 'label' => 'Festivo'],
            ['value' => self::TYPE_CAMPANIA, 'label' => 'Campaña'],
            ['value' => self::TYPE_LANZAMIENTO, 'label' => 'Lanzamiento'],
            ['value' => self::TYPE_EVENT, 'label' => 'Evento'],
        ];
    }
}
