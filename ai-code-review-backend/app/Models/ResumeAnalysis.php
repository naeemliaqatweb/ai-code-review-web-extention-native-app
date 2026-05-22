<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResumeAnalysis extends Model
{
    protected $fillable = [
        'resume_id',
        'score',
        'grammar_corrections',
        'professional_improvements',
        'missing_sections',
        'skill_suggestions',
        'raw_response',
    ];

    protected $casts = [
        'grammar_corrections' => 'array',
        'professional_improvements' => 'array',
        'missing_sections' => 'array',
        'skill_suggestions' => 'array',
        'raw_response' => 'array',
    ];

    public function resume()
    {
        return $this->belongsTo(Resume::class);
    }
}
