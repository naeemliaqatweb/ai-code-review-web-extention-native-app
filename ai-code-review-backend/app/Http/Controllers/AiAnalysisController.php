<?php

namespace App\Http\Controllers;

use App\Models\CodeSubmission;
use App\Services\AiAnalysisService;
use App\Http\Resources\AiAnalysisResource;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Exception;

class AiAnalysisController extends Controller
{
    protected AiAnalysisService $aiService;

    public function __construct(AiAnalysisService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Retrieve analysis history with filters.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['date', 'language']);
        
        $history = $this->aiService->getAnalysisHistory($request->user(), $filters);

        return AiAnalysisResource::collection($history);
    }

    /**
     * Trigger analysis for a code submission.
     */
    public function analyze(Request $request)
    {
        $request->validate([
            'submission_id' => 'required|integer|exists:code_submissions,id',
        ]);

        $submission = CodeSubmission::where('id', $request->submission_id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$submission) {
            return response()->json(['message' => 'Submission not found or unauthorized.'], 404);
        }

        try {
            $analysis = $this->aiService->analyzeSubmission($submission);
            
            return new AiAnalysisResource($analysis);
        } catch (Exception $e) {
            $submission->update(['status' => 'failed']);
            
            return response()->json([
                'message' => 'Analysis failed.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
