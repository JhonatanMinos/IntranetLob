<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Scout\Searchable;

class Notification extends Model
{
    /** @use HasFactory<\Database\Factories\NotificationFactory> */
    use HasFactory;
    use SoftDeletes;
    use Searchable;
    use Notifiable;

    protected $fillable = [
        'title',
        'subject',
        'content',
        'imagen_path',
        'priority',
        'type',
        'published_at',
        'created_by',
    ];



    public function toSearchableArray()
    {
        return [
            'title' => $this->title,
            'priority' => $this->priority,
            'type' => $this->type,
            'published_at' => $this->published_at,
        ];
    }

    public const PRIORITY_NORMAL = 'normal';
    public const PRIORITY_IMPORTANT = 'importante';
    public const PRIORITY_URGENT = 'urgente';

    public const TYPE_ADN = 'adn';
    public const TYPE_BENEFICIOS = 'beneficios';
    public const TYPE_COLABORADORES = 'colaboradores';
    public const TYPE_AVISO = 'aviso';


    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
