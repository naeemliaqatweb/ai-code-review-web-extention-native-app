<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Resume;
use App\Models\ResumeTemplate;
use App\Models\ResumeRewrite;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ResumeFeatureTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_user_can_submit_resume_text()
    {
        $response = $this->actingAs($this->user, 'api')
            ->postJson('/api/resumes', [
                'content' => 'Sample resume text for analysis and rewrite.'
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'original_content', 'analysis', 'rewrite']
            ]);
    }

    public function test_user_can_list_templates()
    {
        ResumeTemplate::create([
            'name' => 'Test Template',
            'slug' => 'test-template',
            'is_premium' => false
        ]);

        $response = $this->actingAs($this->user, 'api')
            ->getJson('/api/resume-templates');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_user_cannot_download_premium_template_without_access()
    {
        $resume = Resume::create([
            'user_id' => $this->user->id,
            'original_content' => 'Content'
        ]);

        ResumeRewrite::create([
            'resume_id' => $resume->id,
            'summary' => 'Summary'
        ]);

        ResumeTemplate::create([
            'name' => 'Premium Template',
            'slug' => 'premium-template',
            'is_premium' => true
        ]);

        $response = $this->actingAs($this->user, 'api')
            ->getJson("/api/resumes/{$resume->id}/download?template=premium-template");

        $response->assertStatus(403)
            ->assertJson(['error' => 'This is a premium template. Please upgrade your plan.']);
    }
}
