<?php

namespace Tests\Feature;

use App\Models\CodeAnalysis;
use App\Models\CodeSubmission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Passport\Passport;
use Tests\TestCase;

class AiAnalysisTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('passport:keys');
        putenv('GEMINI_API_KEY=test_key_123'); // Ensure env variable doesn't fail basic validations
    }

    public function test_it_triggers_gemini_analysis_and_stores_result()
    {
        $user = User::factory()->create();
        Passport::actingAs($user);
        $submission = CodeSubmission::factory()->create(['user_id' => $user->id]);

        // Intercept Gemini outbound calls
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => '```json
{
  "score": 8,
  "bugs": ["Missing semicolon"],
  "improvements": ["Use explicit return types"],
  "security_issues": []
}
```',
                                ],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->postJson('/api/analyze-code', [
            'submission_id' => $submission->id,
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('data.score', 8);

        // Verify it was stored in databse securely
        $this->assertDatabaseHas('code_analyses', [
            'code_submission_id' => $submission->id,
            'score' => 8,
        ]);
    }

    public function test_it_can_fetch_analysis_history_with_cursor_pagination()
    {
        $user = User::factory()->create();
        Passport::actingAs($user);

        // Seed 2 analyses mapped across 2 submissions for this user
        $sub1 = CodeSubmission::factory()->create(['user_id' => $user->id, 'language' => 'php']);
        $sub2 = CodeSubmission::factory()->create(['user_id' => $user->id, 'language' => 'python']);

        CodeAnalysis::factory()->create(['code_submission_id' => $sub1->id]);
        CodeAnalysis::factory()->create(['code_submission_id' => $sub2->id]);

        $response = $this->getJson('/api/analyses');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data'); // Fetches both items from history

        // Test filtering
        $responseFilter = $this->getJson('/api/analyses?language=python');
        $responseFilter->assertStatus(200)
            ->assertJsonCount(1, 'data'); // Should strictly return the python one
    }
}
