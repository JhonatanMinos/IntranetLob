<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Notification extends Model
{
    /** @use HasFactory<\Database\Factories\NotificationFactory> */
    use HasFactory;
    use SoftDeletes;
    use Searchable;

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

    protected $casts = [
        'published_at' => 'datetime',
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

    public const TYPE_AVISO = 'aviso';
    public const TYPE_NOTICIA = 'noticia';
    public const TYPE_ARTICULO = 'articulo';
    public const TYPE_MENSAJE = 'mensaje';

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
