<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResumeRewrite extends Model
{
    protected $fillable = [
        'resume_id',
        'summary',
        'experience',
        'skills',
        'education',
        'profile_image',
        'contact_details',
        'style_config',
    ];

    protected $casts = [
        'experience' => 'array',
        'skills' => 'array',
        'education' => 'array',
        'contact_details' => 'array',
        'style_config' => 'array',
    ];

    public function resume()
    {
        return $this->belongsTo(Resume::class);
    }

    public function versions()
    {
        return $this->hasMany(ResumeRewriteVersion::class);
    }
}
