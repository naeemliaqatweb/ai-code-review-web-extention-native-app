<?php

namespace App\Jobs;

use App\Models\CodeSubmission;
use App\Services\AiAnalysisService;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ProcessAiAnalysis implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public CodeSubmission $submission
    ) {}

    /**
     * Execute the job.
     */
    public function handle(AiAnalysisService $analysisService): void
    {
        try {
            $this->submission->update(['status' => 'processing']);
            Log::info("Job started: AI analysis for submission #{$this->submission->id}");

            
            // Trigger the AI analysis service
            $analysisService->analyzeSubmission($this->submission);
            
            // Status update happens inside analyzeSubmission, 
            // but we can double-ensure here if needed.
            Log::info("Job completed: AI analysis successful for submission #{$this->submission->id}");
        } catch (Exception $e) {
            Log::error("Job failed: AI analysis for submission #{$this->submission->id}: " . $e->getMessage());
            
            $this->submission->update(['status' => 'failed']);
            
            // Re-throw to ensure the job is marked as failed in Horizon/Queue
            throw $e;
        }
    }
}
