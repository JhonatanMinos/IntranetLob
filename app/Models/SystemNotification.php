<?php

namespace App\Models;

use Illuminate\Notifications\DatabaseNotification;

/**
 * App\Models\SystemNotification
 *
 * @description Extensión de la notificación por base de datos estándar de Laravel para usar una tabla personalizada.
 * * --- Atributos de la Base de Datos ---
 * @property string $id UUID de la notificación.
 * @property string $type Clase de la notificación (Fully Qualified Class Name).
 * @property string $notifiable_type Modelo asociado (ej: App\Models\User).
 * @property int $notifiable_id ID del modelo asociado.
 * @property array $data Contenido JSON de la notificación (codificado/decodificado automáticamente).
 * @property \Illuminate\Support\Carbon|null $read_at Fecha y hora en que se marcó como leída.
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * * --- Relaciones ---
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $notifiable El modelo que recibe la notificación (User, etc).
 * * --- Mixins ---
 * @mixin \Illuminate\Database\Eloquent\Builder
 * @method static \Illuminate\Database\Eloquent\Builder|SystemNotification query()
 * @method static \Illuminate\Database\Eloquent\Builder|SystemNotification whereUnread() Scope heredado para filtrar no leídas.
 * @method static \Illuminate\Database\Eloquent\Builder|SystemNotification whereRead() Scope heredado para filtrar leídas.
 */
class SystemNotification extends DatabaseNotification
{
    /**
    * El nombre de la tabla asociada al model
    * * @var string
    */
    protected $table = 'system_notifications';
}
