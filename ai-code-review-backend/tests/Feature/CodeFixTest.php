<?php

namespace Tests\Feature;

use App\Models\CodeAnalysis;
use App\Models\CodeSubmission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Passport\Passport;
use Tests\TestCase;

class CodeFixTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('passport:keys');
        putenv('GEMINI_API_KEY=test_key_123');
    }

    /**
     * Test that fix mode correctly parses and stores AI suggestions.
     */
    public function test_it_handles_fix_mode_analysis_with_enhanced_details()
    {
        $user = User::factory()->create();
        Passport::actingAs($user);

        $submission = CodeSubmission::factory()->create([
            'user_id' => $user->id,
            'mode' => 'fix',
            'content' => 'function test() { eval("alert(1)"); }',
        ]);

        // Mock Gemini response with fix details
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => '```json
{
  "score": 3,
  "bugs": ["Dangerous use of eval"],
  "security_issues": ["Arbitrary Code Execution"],
  "improvements": ["Replace eval with safe alternatives"],
  "fixed_code": "function test() { console.log(\"safe\"); }",
  "fixed_explanation": "Removed dangerous eval function to prevent ACE vulnerabilities.",
  "fixed_improvements": ["Security Hardening", "Best Practices"]
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

        // Assert database has the new fields
        $this->assertDatabaseHas('code_analyses', [
            'code_submission_id' => $submission->id,
            'fixed_explanation' => 'Removed dangerous eval function to prevent ACE vulnerabilities.',
        ]);

        $analysis = CodeAnalysis::where('code_submission_id', $submission->id)->first();
        $this->assertEquals('function test() { console.log("safe"); }', $analysis->fixed_code);
        $this->assertIsArray($analysis->fixed_improvements);
        $this->assertContains('Security Hardening', $analysis->fixed_improvements);
    }

    /**
     * Test that applying a fix updates the submission and creates a version.
     */
    public function test_it_successfully_applies_suggested_fix_and_creates_version()
    {
        $user = User::factory()->create();
        Passport::actingAs($user);

        $originalContent = 'function test() { eval("alert(1)"); }';
        $fixedContent = 'function test() { console.log("safe"); }';

        $submission = CodeSubmission::factory()->create([
            'user_id' => $user->id,
            'content' => $originalContent,
            'mode' => 'fix',
        ]);

        // Manually create an analysis with fixed_code
        CodeAnalysis::create([
            'code_submission_id' => $submission->id,
            'score' => 5,
            'bugs' => [],
            'security_issues' => [],
            'improvements' => [],
            'fixed_code' => $fixedContent,
            'fixed_explanation' => 'Fix applied.',
            'fixed_improvements' => ['Security'],
        ]);

        $response = $this->postJson("/api/submissions/{$submission->id}/apply-fix");

        $response->assertStatus(200);
        $response->assertJsonPath('data.content', $fixedContent);

        // Verify original code was backed up
        $this->assertDatabaseHas('submission_versions', [
            'code_submission_id' => $submission->id,
            'content' => $originalContent,
            'version_number' => 1,
        ]);

        // Verify submission content is updated
        $this->assertEquals($fixedContent, $submission->fresh()->content);
    }

    /**
     * Test incrementing version numbers.
     */
    public function test_it_increments_version_numbers_correctly()
    {
        $user = User::factory()->create();
        Passport::actingAs($user);

        $submission = CodeSubmission::factory()->create(['user_id' => $user->id, 'content' => 'v0']);

        // Version 1
        $submission->versions()->create(['content' => 'v0', 'version_number' => 1]);

        // Prepare a fix to apply
        CodeAnalysis::create([
            'code_submission_id' => $submission->id,
            'score' => 5,
            'bugs' => [],
            'security_issues' => [],
            'improvements' => [],
            'fixed_code' => 'v1',
            'fixed_explanation' => 'Fix applied.',
            'fixed_improvements' => [],
        ]);

        $this->postJson("/api/submissions/{$submission->id}/apply-fix")->assertStatus(200);

        $this->assertDatabaseHas('submission_versions', [
            'code_submission_id' => $submission->id,
            'version_number' => 2,
        ]);
    }

    /**
     * Test that users cannot apply fixes to others' submissions.
     */
    public function test_it_prevents_unauthorized_users_from_applying_fixes()
    {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();

        $submission = CodeSubmission::factory()->create(['user_id' => $owner->id]);

        Passport::actingAs($stranger);
        $response = $this->postJson("/api/submissions/{$submission->id}/apply-fix");

        // Should return 404 because getSubmissionById uses failOnFind or similar restriction
        $response->assertStatus(404);
    }

    /**
     * Test applying fix when no fixed code is available.
     */
    public function test_it_prevents_applying_fix_without_fixed_code()
    {
        $user = User::factory()->create();
        Passport::actingAs($user);

        $submission = CodeSubmission::factory()->create(['user_id' => $user->id]);

        $response = $this->postJson("/api/submissions/{$submission->id}/apply-fix");

        $response->assertStatus(422);
        $response->assertJsonFragment(['message' => 'No fixed code available to apply.']);
    }
}
