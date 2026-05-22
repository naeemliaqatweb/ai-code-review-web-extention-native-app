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
        Schema::table('code_analyses', function (Blueprint $table) {
            $table->text('fixed_explanation')->nullable()->after('fixed_code');
            $table->json('fixed_improvements')->nullable()->after('fixed_explanation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('code_analyses', function (Blueprint $table) {
            $table->dropColumn(['fixed_explanation', 'fixed_improvements']);
        });
    }
};
