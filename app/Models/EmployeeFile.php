<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class EmployeeFile extends Model
{
    /** @use HasFactory<\Database\Factories\EmployeeFileFactory> */
    use HasFactory;
    use Searchable;

    protected $fillable = [
        'emergency_contact_name',
        'emergency_contact_phone',
        'documents',
        'user_id',
    ];

    protected $casts = [
        'documents' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
