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
        Schema::table('code_submissions', function (Blueprint $table) {
            $table->string('mode')->default('review')->after('language');
        });

        Schema::table('code_analyses', function (Blueprint $table) {
            $table->longText('fixed_code')->nullable()->after('security_issues');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('code_submissions', function (Blueprint $table) {
            $table->dropColumn('mode');
        });

        Schema::table('code_analyses', function (Blueprint $table) {
            $table->dropColumn('fixed_code');
        });
    }
};
