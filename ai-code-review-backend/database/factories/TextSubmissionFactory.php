<?php

namespace Database\Factories;

use App\Models\TextSubmission;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TextSubmission>
 */
class TextSubmissionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->sentence(),
            'content' => $this->faker->paragraphs(3, true),
            'mode' => $this->faker->randomElement(['grammar', 'rewrite', 'summarize', 'improve']),
            'status' => 'pending',
        ];
    }
}
