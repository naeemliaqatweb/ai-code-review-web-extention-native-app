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
        Schema::create('submission_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('code_submission_id')->constrained()->onDelete('cascade');
            $table->longText('content');
            $table->integer('version_number');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_versions');
    }
};
