<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

use App\Http\Controllers\CodeSubmissionController;
use App\Http\Controllers\AiAnalysisController;
use App\Http\Controllers\ResumeController;

Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/submissions', [CodeSubmissionController::class, 'store']);
    Route::get('/submissions', [CodeSubmissionController::class, 'index']);
    Route::get('/submissions/{id}', [CodeSubmissionController::class, 'show']);
    Route::delete('/submissions/{id}', [CodeSubmissionController::class, 'destroy']);
    Route::post('/submissions/{id}/apply-fix', [CodeSubmissionController::class, 'applyFix']);

    // Text Assistant Routes
    Route::post('/text-submissions', [\App\Http\Controllers\TextSubmissionController::class, 'store']);
    Route::get('/text-submissions', [\App\Http\Controllers\TextSubmissionController::class, 'index']);
    Route::get('/text-submissions/{id}', [\App\Http\Controllers\TextSubmissionController::class, 'show']);
    Route::delete('/text-submissions/{id}', [\App\Http\Controllers\TextSubmissionController::class, 'destroy']);

    // Resume Builder Routes
    Route::post('/resumes', [ResumeController::class, 'store']);
    Route::get('/resumes', [ResumeController::class, 'index']);
    Route::get('/resumes/{id}', [ResumeController::class, 'show']);
    Route::put('/resumes/{id}/rewrite', [ResumeController::class, 'updateRewrite']);
    Route::post('/resumes/{id}/upload-photo', [ResumeController::class, 'uploadPhoto']);
    Route::get('/resumes/{id}/history', [ResumeController::class, 'history']);
    Route::get('/resume-templates', [ResumeController::class, 'templates']);
    Route::get('/resumes/{id}/download', [ResumeController::class, 'download']);
    Route::delete('/resumes/{id}', [ResumeController::class, 'destroy']);

    Route::middleware('throttle:ai-requests')->group(function () {
        Route::post('/analyze-code', [AiAnalysisController::class, 'analyze']);
    });
    
    Route::get('/analyses', [AiAnalysisController::class, 'index']);
});
