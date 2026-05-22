<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('text_analyses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('text_submission_id')->constrained()->cascadeOnDelete();
            $table->integer('score')->nullable();
            $table->json('bugs')->nullable(); // Linguistic errors
            $table->json('improvements')->nullable(); // Stylistic suggestions
            $table->longText('processed_text')->nullable(); // The improved version
            $table->text('explanation')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('text_analyses');
    }
};
