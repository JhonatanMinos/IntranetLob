<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Company extends Model
{
    /** @use HasFactory<\Database\Factories\CompanyFactory> */
    use HasFactory;
    use SoftDeletes;
    use Searchable;

    protected $fillable = ['name'];

    public function toSearchableArray()
    {
        return [
            'name' => $this->name,
        ];
    }

    public function user(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
