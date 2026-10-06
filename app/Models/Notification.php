<?php

namespace App\Models;

use Database\Factories\NotificationFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Scout\Searchable;
use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

class Notification extends Model
{
    /** @use HasFactory<NotificationFactory> */
    use HasFactory;

    use Notifiable;
    use Searchable;
    use SoftDeletes;

    protected $fillable = [
        'id',
        'title',
        'subject',
        'content',
        'imagen_path',
        'priority',
        'type',
        'published_at',
        'created_by',
    ];

    protected function content(): Attribute
    {
        $sanitize = static fn ($value) => (new HtmlSanitizer(
            (new HtmlSanitizerConfig)->allowSafeElements()
        ))->sanitize($value ?? '');

        return Attribute::make(get: $sanitize, set: $sanitize);
    }

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
