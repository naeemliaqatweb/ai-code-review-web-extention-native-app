<?php

namespace App\Jobs;

use App\Models\TextSubmission;
use App\Services\AiAnalysisService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessTextAnalysis implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected TextSubmission $submission;

    /**
     * Create a new job instance.
     */
    public function __construct(TextSubmission $submission)
    {
        $this->submission = $submission;
    }

    /**
     * Execute the job.
     */
    public function handle(AiAnalysisService $aiService): void
    {
        $this->submission->update(['status' => 'processing']);

        try {
            $aiService->analyzeTextSubmission($this->submission);
            $this->submission->update(['status' => 'completed']);
        } catch (\Exception $e) {
            \Log::error('Text Analysis Job Failed: '.$e->getMessage());
            $this->submission->update(['status' => 'failed']);
        }
    }
}
