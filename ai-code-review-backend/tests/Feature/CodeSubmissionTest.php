<?php

namespace Tests\Feature;

use App\Jobs\ProcessAiAnalysis;
use App\Models\CodeSubmission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Laravel\Passport\Passport;
use Tests\TestCase;

class CodeSubmissionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('passport:keys');
    }

    public function test_unauthenticated_user_cannot_access_submissions()
    {
        $response = $this->getJson('/api/submissions');
        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_submit_code_and_dispatch_job()
    {
        Queue::fake();

        $user = User::factory()->create();
        Passport::actingAs($user);

        $payload = [
            'title' => 'My First Script',
            'language' => 'php',
            'content' => '<?php echo "Hello"; ?>',
        ];

        $response = $this->postJson('/api/submissions', $payload);

        $response->assertStatus(201);

        Queue::assertPushed(ProcessAiAnalysis::class, function ($job) use ($user) {
            return $job->submission->title === 'My First Script' && $job->submission->user_id === $user->id;
        });
    }

    public function test_user_can_list_their_submissions()
    {
        $user = User::factory()->create();
        Passport::actingAs($user);

        CodeSubmission::factory()->count(3)->create(['user_id' => $user->id]);

        // Create submissions for another user to ensure isolation
        CodeSubmission::factory()->count(2)->create();

        $response = $this->getJson('/api/submissions');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data'); // Should only see their 3 items
    }
}
