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
        Schema::create('code_analyses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('code_submission_id')->constrained()->cascadeOnDelete();
            $table->json('bugs')->nullable();
            $table->json('improvements')->nullable();
            $table->json('security_issues')->nullable();
            $table->integer('score')->nullable();
            $table->json('raw_response')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('code_analyses');
    }
};
