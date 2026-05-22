<?php

namespace App\Services;

use App\Jobs\ProcessAiAnalysis;
use App\Models\CodeSubmission;
use App\Models\User;
use Exception;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Support\Facades\DB;

class CodeSubmissionService
{
    protected AiAnalysisService $analysisService;

    public function __construct(AiAnalysisService $analysisService)
    {
        $this->analysisService = $analysisService;
    }

    /**
     * Create a new code submission for a user.
     */
    public function createSubmission(array $data, User $user): CodeSubmission
    {
        $submission = $user->codeSubmissions()->create([
            'title' => $data['title'],
            'language' => $data['language'],
            'content' => $data['content'],
            'mode' => $data['mode'] ?? 'review',
            'status' => 'pending',
        ]);

        // Dispatch background job for AI analysis
        ProcessAiAnalysis::dispatch($submission);

        return $submission;
    }

    /**
     * Retrieve all code submissions for a user.
     */
    public function getUserSubmissions(User $user): CursorPaginator
    {
        return $user->codeSubmissions()->with('analysis')->latest()->cursorPaginate(15);
    }

    /**
     * Retrieve a specific code submission by ID, ensuring user owns it.
     */
    public function getSubmissionById(int $id, User $user): ?CodeSubmission
    {
        return $user->codeSubmissions()->with('analysis')->findOrFail($id);
    }

    /**
     * Delete a specific code submission, ensuring user owns it.
     */
    public function deleteSubmission(int $id, User $user): bool
    {
        $submission = $this->getSubmissionById($id, $user);

        return $submission->delete();
    }

    /**
     * Apply the AI suggested fix to a submission.
     */
    public function applyFix(int $id, User $user): CodeSubmission
    {
        return DB::transaction(function () use ($id, $user) {
            $submission = $this->getSubmissionById($id, $user);
            $analysis = $submission->analysis;

            if (! $analysis || ! $analysis->fixed_code) {
                throw new Exception('No fixed code available to apply.');
            }

            // 1. Create a version of the CURRENT content
            $versionCount = $submission->versions()->count();
            $submission->versions()->create([
                'content' => $submission->content,
                'version_number' => $versionCount + 1,
            ]);

            // 2. Update the submission with the FIXED code
            $submission->update([
                'content' => $analysis->fixed_code,
                // We could also re-trigger analysis if we want to "review" the fix
                // but usually the fix is the "end goal".
            ]);

            return $submission->load(['analysis', 'versions']);
        });
    }
}
