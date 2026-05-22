<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CodeAnalysis extends Model
{
    use HasFactory;

    protected $fillable = [
        'code_submission_id',
        'bugs',
        'improvements',
        'security_issues',
        'score',
        'raw_response',
        'fixed_code',
        'fixed_explanation',
        'fixed_improvements',
    ];

    protected function casts(): array
    {
        return [
            'bugs' => 'array',
            'improvements' => 'array',
            'security_issues' => 'array',
            'raw_response' => 'array',
            'fixed_improvements' => 'array',
        ];
    }

    /**
     * Get the submission that owns the analysis.
     */
    public function codeSubmission(): BelongsTo
    {
        return $this->belongsTo(\App\Models\CodeSubmission::class);
    }
}
