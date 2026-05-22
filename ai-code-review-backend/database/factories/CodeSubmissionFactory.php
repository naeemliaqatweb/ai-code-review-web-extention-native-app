<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CodeSubmission>
 */
class CodeSubmissionFactory extends Factory
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
            'language' => $this->faker->randomElement(['php', 'python', 'javascript', 'rust', 'go']),
            'content' => $this->faker->text(),
            'type' => 'code',
            'mode' => 'review',
        ];
    }
}
