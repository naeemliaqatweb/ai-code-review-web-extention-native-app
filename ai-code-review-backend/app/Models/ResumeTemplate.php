<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResumeTemplate extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'preview_url',
        'is_premium',
    ];

    protected $casts = [
        'is_premium' => 'boolean',
    ];
}
