<?php

namespace App\Http\Controllers;

use App\Http\Resources\TextSubmissionResource;
use App\Services\TextSubmissionService;
use Illuminate\Http\Request;

class TextSubmissionController extends Controller
{
    protected TextSubmissionService $textService;
    protected \App\Services\AiAnalysisService $aiService;

    public function __construct(TextSubmissionService $textService, \App\Services\AiAnalysisService $aiService)
    {
        $this->textService = $textService;
        $this->aiService = $aiService;
    }

    /**
     * Display a listing of the user's text submissions.
     */
    public function index(Request $request)
    {
        $submissions = $this->textService->getUserSubmissions($request->user());
        return TextSubmissionResource::collection($submissions);
    }

    /**
     * Store a newly created text submission.
     */
    public function store(Request $request)
    {
        // Enforce 20 audit limit
        if ($request->user()->textSubmissions()->count() >= 20) {
            return response()->json([
                'message' => 'You have reached the maximum limit of 20 text audits. Please delete existing audits to create new ones.'
            ], 403);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:100000',
            'mode' => 'required|string|in:grammar,rewrite,summarize,improve',
        ]);

        $submission = $this->textService->createSubmission($validatedData, $request->user());

        // Perform synchronous AI analysis
        try {
            $this->aiService->analyzeTextSubmission($submission);
            $submission->load('analysis');
        } catch (\Exception $e) {
            \Log::error('Synchronous Text Analysis Failed: ' . $e->getMessage());
            // Submission is still created, but status will remain pending/failed
        }

        return new TextSubmissionResource($submission);
    }

    /**
     * Display the specified text submission.
     */
    public function show(Request $request, int $id)
    {
        $submission = $this->textService->getSubmissionById($id, $request->user());
        return new TextSubmissionResource($submission);
    }

    /**
     * Remove the specified text submission from storage.
     */
    public function destroy(Request $request, int $id)
    {
        $this->textService->deleteSubmission($id, $request->user());
        return response()->json(['message' => 'Text submission deleted successfully']);
    }
}
