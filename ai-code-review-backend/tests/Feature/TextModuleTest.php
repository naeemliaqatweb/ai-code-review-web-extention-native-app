<?php

namespace Tests\Feature;

use App\Jobs\ProcessTextAnalysis;
use App\Models\TextSubmission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class TextModuleTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_user_can_create_text_submission()
    {
        Queue::fake();

        $response = $this->actingAs($this->user, 'api')
            ->postJson('/api/text-submissions', [
                'title' => 'Test Text',
                'content' => 'This is a test text with some bad grammer.',
                'mode' => 'grammar',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'Test Text')
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('text_submissions', [
            'title' => 'Test Text',
            'user_id' => $this->user->id,
        ]);

        Queue::assertPushed(ProcessTextAnalysis::class);
    }

    public function test_user_can_list_text_submissions()
    {
        TextSubmission::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'api')
            ->getJson('/api/text-submissions');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_user_can_view_single_text_submission()
    {
        $submission = TextSubmission::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'api')
            ->getJson("/api/text-submissions/{$submission->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $submission->id);
    }

    public function test_user_cannot_exceed_20_submissions()
    {
        TextSubmission::factory()->count(20)->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'api')
            ->postJson('/api/text-submissions', [
                'title' => 'Excessive Text',
                'content' => 'This should fail.',
                'mode' => 'grammar',
            ]);

        $response->assertStatus(403)
            ->assertJsonPath('message', 'You have reached the maximum limit of 20 text audits. Please delete existing audits to create new ones.');
    }

    public function test_user_can_delete_text_submission()
    {
        $submission = TextSubmission::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'api')
            ->deleteJson("/api/text-submissions/{$submission->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('text_submissions', ['id' => $submission->id]);
    }
}
