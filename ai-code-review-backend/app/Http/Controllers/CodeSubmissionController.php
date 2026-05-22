<?php

namespace App\Http\Controllers;

use App\Http\Resources\CodeSubmissionResource;
use App\Services\CodeSubmissionService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class CodeSubmissionController extends Controller
{
    protected CodeSubmissionService $submissionService;

    public function __construct(CodeSubmissionService $submissionService)
    {
        $this->submissionService = $submissionService;
    }

    /**
     * Display a listing of the user's submissions.
     */
    public function index(Request $request)
    {
        $submissions = $this->submissionService->getUserSubmissions($request->user());

        return CodeSubmissionResource::collection($submissions);
    }

    /**
     * Store a newly created code submission.
     */
    public function store(Request $request)
    {
        // Enforce 20 submission limit
        if ($request->user()->codeSubmissions()->count() >= 20) {
            return response()->json([
                'message' => 'You have reached the maximum limit of 20 code reviews. Please delete existing submissions to create new ones.',
            ], 403);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'language' => 'required|string|max:50',
            'content' => 'required|string|max:50000',
            'mode' => 'sometimes|string|in:review,fix,explain',
        ]);

        $submission = $this->submissionService->createSubmission($validatedData, $request->user());

        return new CodeSubmissionResource($submission);
    }

    /**
     * Display the specified code submission.
     */
    public function show(Request $request, int $id)
    {
        $submission = $this->submissionService->getSubmissionById($id, $request->user());

        return new CodeSubmissionResource($submission);
    }

    /**
     * Remove the specified code submission from storage.
     */
    public function destroy(Request $request, int $id)
    {
        $this->submissionService->deleteSubmission($id, $request->user());

        return response()->json(['message' => 'Submission deleted successfully']);
    }

    /**
     * Apply the AI suggested fix to the submission.
     */
    public function applyFix(Request $request, int $id)
    {
        try {
            $submission = $this->submissionService->applyFix($id, $request->user());

            return new CodeSubmissionResource($submission);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Submission not found.'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
