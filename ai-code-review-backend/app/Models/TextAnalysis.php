<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TextAnalysis extends Model
{
    use HasFactory;

    protected $fillable = [
        'text_submission_id',
        'score',
        'bugs',
        'improvements',
        'processed_text',
        'explanation',
    ];

    protected $casts = [
        'bugs' => 'array',
        'improvements' => 'array',
    ];

    /**
     * Get the submission that owns the analysis.
     */
    public function textSubmission(): BelongsTo
    {
        return $this->belongsTo(TextSubmission::class);
    }
}
