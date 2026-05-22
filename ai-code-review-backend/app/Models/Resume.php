<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resume extends Model
{
    protected $fillable = [
        'user_id',
        'original_content',
        'file_path',
        'extracted_text',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function analysis()
    {
        return $this->hasOne(ResumeAnalysis::class);
    }

    public function rewrite()
    {
        return $this->hasOne(ResumeRewrite::class);
    }
}
