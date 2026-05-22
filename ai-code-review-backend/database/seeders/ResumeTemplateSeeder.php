<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ResumeTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\ResumeTemplate::create([
            'name' => 'Modern Minimalist',
            'slug' => 'modern-minimalist',
            'preview_url' => '/templates/modern.png',
            'is_premium' => false,
        ]);

        \App\Models\ResumeTemplate::create([
            'name' => 'Professional Corporate',
            'slug' => 'professional-corporate',
            'preview_url' => '/templates/professional.png',
            'is_premium' => false,
        ]);

        \App\Models\ResumeTemplate::create([
            'name' => 'Creative Designer',
            'slug' => 'creative-designer',
            'preview_url' => '/templates/creative.png',
            'is_premium' => true,
        ]);
    }
}
