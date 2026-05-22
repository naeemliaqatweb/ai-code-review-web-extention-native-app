<?php
/*
 * Created At: 2026-04-17T20:35:50Z
 * File Path: tests/Feature/QueueAnalysisTest.php
 */

namespace Tests\Feature;

use App\Models\User;
use App\Models\CodeSubmission;
use App\Models\CodeAnalysis;
use App\Jobs\ProcessAiAnalysis;
use App\Services\AiAnalysisService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;
use Exception;

class QueueAnalysisTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        putenv('GEMINI_API_KEY=test_key_123');
    }

    public function test_job_execution_updates_status_to_completed_on_success()
    {
        $user = User::factory()->create();
        $submission = CodeSubmission::factory()->create([
            'user_id' => $user->id,
            'type' => 'code',
            'status' => 'pending'
        ]);

        // Mock Gemini Response
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => '```json
{
  "score": 9,
  "bugs": [],
  "improvements": ["Perfect code"],
  "security_issues": []
}
```'
                                ]
                            ]
                        ]
                    ]
                ]
            ], 200)
        ]);

        // Execute Job
        $job = new ProcessAiAnalysis($submission);
        $job->handle(app(AiAnalysisService::class));

        // Refresh and check status
        $submission->refresh();
        $this->assertEquals('completed', $submission->status);
        
        // Verify analysis was stored
        $this->assertDatabaseHas('code_analyses', [
            'code_submission_id' => $submission->id,
            'score' => 9
        ]);
    }

    public function test_job_execution_updates_status_to_failed_on_error()
    {
        $user = User::factory()->create();
        $submission = CodeSubmission::factory()->create([
            'user_id' => $user->id,
            'type' => 'code',
            'status' => 'pending'
        ]);

        // Mock API Error
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response(['error' => 'API Down'], 500)
        ]);

        // Execute Job - expecting exception
        $job = new ProcessAiAnalysis($submission);
        
        try {
            $job->handle(app(AiAnalysisService::class));
        } catch (Exception $e) {
            // Expected
        }

        // Refresh and check status
        $submission->refresh();
        $this->assertEquals('failed', $submission->status);
    }

    public function test_job_execution_for_text_grammar_mode()
    {
        $user = User::factory()->create();
        $submission = CodeSubmission::factory()->create([
            'user_id' => $user->id,
            'type' => 'text',
            'mode' => 'grammar',
            'content' => 'I has a cheeseburger.',
            'status' => 'pending'
        ]);

        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => '```json
{
  "score": 7,
  "bugs": ["Subject-verb agreement error: \"I has\" should be \"I have\""],
  "improvements": ["Consider context: is this a meme reference or formal writing?"],
  "fixed_code": "I have a cheeseburger.",
  "fixed_explanation": "Corrected grammar error."
}
```'
                                ]
                            ]
                        ]
                    ]
                ]
            ], 200)
        ]);

        $job = new ProcessAiAnalysis($submission);
        $job->handle(app(AiAnalysisService::class));

        $submission->refresh();
        $this->assertEquals('completed', $submission->status);
        $this->assertDatabaseHas('code_analyses', [
            'code_submission_id' => $submission->id,
            'fixed_code' => 'I have a cheeseburger.',
            'score' => 7
        ]);
    }

    public function test_job_execution_for_text_summarize_mode()
    {
        $user = User::factory()->create();
        $submission = CodeSubmission::factory()->create([
            'user_id' => $user->id,
            'type' => 'text',
            'mode' => 'summarize',
            'content' => 'The quick brown fox jumps over the lazy dog. This sentence is famous for containing every letter of the alphabet.',
            'status' => 'pending'
        ]);

        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => '```json
{
  "score": 10,
  "bugs": [],
  "improvements": [],
  "fixed_code": "Legendary alphabet sentence featuring a fox and a dog.",
  "fixed_explanation": "Summarized the key point of the text."
}
```'
                                ]
                            ]
                        ]
                    ]
                ]
            ], 200)
        ]);

        $job = new ProcessAiAnalysis($submission);
        $job->handle(app(AiAnalysisService::class));

        $submission->refresh();
        $this->assertEquals('completed', $submission->status);
        $this->assertDatabaseHas('code_analyses', [
            'code_submission_id' => $submission->id,
            'fixed_code' => 'Legendary alphabet sentence featuring a fox and a dog.'
        ]);
    }
}
