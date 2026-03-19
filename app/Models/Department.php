<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Department extends Model
{
    /** @use HasFactory<\Database\Factories\DepartmentFactory> */
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


    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
