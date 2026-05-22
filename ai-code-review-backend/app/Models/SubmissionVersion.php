<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubmissionVersion extends Model
{
    use HasFactory;

    protected $fillable = [
        'code_submission_id',
        'content',
        'version_number',
    ];

    /**
     * Get the code submission that owns the version.
     */
    public function codeSubmission(): BelongsTo
    {
        return $this->belongsTo(CodeSubmission::class);
    }
}
