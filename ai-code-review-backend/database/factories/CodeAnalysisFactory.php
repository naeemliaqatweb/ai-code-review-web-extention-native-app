<?php

namespace Database\Factories;

use App\Models\CodeAnalysis;
use App\Models\CodeSubmission;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CodeAnalysis>
 */
class CodeAnalysisFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code_submission_id' => CodeSubmission::factory(),
            'bugs' => [$this->faker->sentence()],
            'improvements' => [$this->faker->sentence()],
            'security_issues' => [],
            'score' => $this->faker->numberBetween(1, 10),
            'raw_response' => ['generated_by' => 'factory_seed'],
        ];
    }
}
