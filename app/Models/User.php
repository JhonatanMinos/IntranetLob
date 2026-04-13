<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

/**
 * App\Models\User
 *
 * @description Entidad de usuario con capacidades de autenticación, roles, y gestión de expediente.
 * * --- Atributos de la Base de Datos ---
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string|null $employeeNumber Número de nómina o empleado.
 * @property string|null $position Cargo o puesto que ocupa.
 * @property \Illuminate\Support\Carbon|null $birthday
 * @property \Illuminate\Support\Carbon|null $dateEntry Fecha de ingreso a la empresa.
 * @property string|null $phone
 * @property int|null $department_id
 * @property int|null $company_id
 * @property int|null $store_id
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property \Illuminate\Support\Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * * --- Relaciones ---
 * @property-read \App\Models\Department|null $department
 * @property-read \App\Models\Store|null $store
 * @property-read \App\Models\Company|null $company
 * @property-read \App\Models\EmployeeFile|null $employeeFile Expediente digital del empleado.
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Notification> $createdNotifications Notificaciones creadas por este usuario.
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SystemNotification> $notifications Notificaciones polimórficas recibidas.
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SystemNotification> $unreadNotifications
 * * --- Mixins y Seguridad ---
 * @mixin \Illuminate\Database\Eloquent\Builder
 * @mixin \Spatie\Permission\Traits\HasRoles
 * @mixin \Laravel\Fortify\TwoFactorAuthenticatable
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;
    use Notifiable;
    use TwoFactorAuthenticatable;
    use SoftDeletes;
    use HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'employeeNumber',
        'position',
        'birthday',
        'dateEntry',
        'phone',
        'department_id',
        'company_id',
        'store_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'date_entry' => 'date',
        ];
    }

    /**
    *  Mutator para encriptar la contraseña automáticamente
    * * @param string $value
    * @return void
    */
    public function setPasswordAttribute($value): void
    {
        $this->attributes['password'] = Hash::needsRehash($value) ? Hash::make($value) : $value;
    }

    /** @return BelongsTo<App\Models\Departament, self> */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /** @return BelongsTo<App\Models\Store, self> */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /** @return BelongsTo<App\Models\Company, self> */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /** @return HasMany<\App\Models\Notification, self> */
    public function createdNotifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'created_by');
    }

    /** @return HasOne<\App\Models\EmployeeFile, self> */
    public function employeeFile(): HasOne
    {
        return $this->hasOne(EmployeeFile::class);
    }

    /** @return MorphMany<\App\Models\SystemNotification, self> */
    public function notifications()
    {
        return $this->morphMany(SystemNotification::class, 'notifiable')
            ->orderBy('created_at', 'desc');
    }

    /** @return MorphMany<\App\Models\SystemNotification, self> */
    public function unreadNotifications()
    {
        return $this->morphMany(SystemNotification::class, 'notifiable')
            ->whereNull('read_at')
            ->orderBy('created_at', 'desc');
    }

    /** @return HasMany<App\Models\PayRollFiles, self>*/
    public function payRollFiles(): HasMany
    {
        return $this->hasMany(PayRollFiles::class);
    }
}
