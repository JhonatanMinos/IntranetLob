<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PayRoll extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'period_start',
        'period_end',
        'period_type',
        'zip_path',
        'zip_original_name',
        'zip_size',
        'status',
        'error_message',
        'total_files',
        'processed_files',
    ];

    protected $table = 'payroll';

    protected $casts = [
        'period_start' => 'date',
        'period_end'    =>  'date',
    ];

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function files(): HasMany
    {
        return $this->hasMany(PayRollFiles::class);
    }
}
