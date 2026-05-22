<?php

namespace App\Services;

use App\Models\TextSubmission;
use App\Models\User;
use Illuminate\Contracts\Pagination\CursorPaginator;

class TextSubmissionService
{
    /**
     * Create a new text submission.
     */
    /**
     * Create a new text submission.
     */
    public function createSubmission(array $data, User $user): TextSubmission
    {
        return $user->textSubmissions()->create([
            'title' => $data['title'],
            'content' => $data['content'],
            'mode' => $data['mode'] ?? 'grammar',
            'status' => 'pending',
        ]);
    }

    /**
     * Get user submissions.
     */
    public function getUserSubmissions(User $user): CursorPaginator
    {
        return $user->textSubmissions()->with('analysis')->latest()->cursorPaginate(15);
    }

    /**
     * Get submission by ID.
     */
    public function getSubmissionById(int $id, User $user): TextSubmission
    {
        return $user->textSubmissions()->with('analysis')->findOrFail($id);
    }

    /**
     * Delete submission.
     */
    public function deleteSubmission(int $id, User $user): bool
    {
        $submission = $this->getSubmissionById($id, $user);

        return $submission->delete();
    }
}
