<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResumeRewriteVersion extends Model
{
    protected $fillable = [
        'resume_rewrite_id',
        'summary',
        'experience',
        'skills',
        'education',
        'version_number',
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

    public function rewrite()
    {
        return $this->belongsTo(ResumeRewrite::class, 'resume_rewrite_id');
    }
}
