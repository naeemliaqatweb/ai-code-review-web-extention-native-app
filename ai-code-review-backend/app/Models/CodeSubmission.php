<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class CodeSubmission extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'language',
        'content',
        'status',
        'mode',
        'type',
    ];

    /**
     * Get the user that owns the code submission.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the analysis document associated with the submission.
     */
    public function analysis(): HasOne
    {
        return $this->hasOne(CodeAnalysis::class);
    }

    /**
     * Get the historical versions of the submission.
     */
    public function versions(): HasMany
    {
        return $this->hasMany(SubmissionVersion::class);
    }
}
