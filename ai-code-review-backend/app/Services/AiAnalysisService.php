<?php

namespace App\Services;

use App\Models\CodeAnalysis;
use App\Models\CodeSubmission;
use App\Models\Resume;
use App\Models\ResumeAnalysis;
use App\Models\ResumeRewrite;
use App\Models\TextAnalysis;
use App\Models\TextSubmission;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiAnalysisService
{
    /**
     * Send code submission to Gemini and store the analysis.
     */
    public function analyzeSubmission(CodeSubmission $submission): CodeAnalysis
    {
        $promptConfig = $this->prepareCodePrompt($submission);
        $parsedData = $this->callGemini($promptConfig['prompt']);

        // Store the result
        $analysis = $submission->analysis()->updateOrCreate(
            ['code_submission_id' => $submission->id],
            [
                'score' => $parsedData['score'] ?? null,
                'bugs' => $parsedData['bugs'] ?? [],
                'improvements' => $parsedData['improvements'] ?? [],
                'security_issues' => $parsedData['security_issues'] ?? [],
                'fixed_code' => $parsedData['fixed_code'] ?? null,
                'fixed_explanation' => $parsedData['fixed_explanation'] ?? null,
                'fixed_improvements' => $parsedData['fixed_improvements'] ?? [],
            ]
        );

        $submission->update(['status' => 'completed']);

        return $analysis;
    }

    /**
     * Send text submission to Gemini and store the analysis.
     */
    public function analyzeTextSubmission(TextSubmission $submission): TextAnalysis
    {
        $promptConfig = $this->prepareTextPrompt($submission);
        $parsedData = $this->callGemini($promptConfig['prompt']);

        // Store the result
        $analysis = $submission->analysis()->updateOrCreate(
            ['text_submission_id' => $submission->id],
            [
                'score' => $parsedData['score'] ?? null,
                'bugs' => $parsedData['bugs'] ?? [],
                'improvements' => $parsedData['improvements'] ?? [],
                'processed_text' => $parsedData['fixed_code'] ?? null, // Map back for schema consistency
                'explanation' => $parsedData['fixed_explanation'] ?? null,
            ]
        );

        $submission->update(['status' => 'completed']);

        return $analysis;
    }

    /**
     * Send resume to Gemini and store the analysis.
     */
    public function analyzeResumeSubmission(Resume $resume): ResumeAnalysis
    {
        $promptConfig = $this->prepareResumePrompt($resume);
        $parsedData = $this->callGemini($promptConfig['prompt']);

        // Store the result
        $analysis = $resume->analysis()->updateOrCreate(
            ['resume_id' => $resume->id],
            [
                'score' => $parsedData['score'] ?? null,
                'grammar_corrections' => $parsedData['grammar_corrections'] ?? [],
                'professional_improvements' => $parsedData['professional_improvements'] ?? [],
                'missing_sections' => $parsedData['missing_sections'] ?? [],
                'skill_suggestions' => $parsedData['skill_suggestions'] ?? [],
                'raw_response' => $parsedData,
            ]
        );

        $resume->update(['status' => 'completed']);

        return $analysis;
    }

    /**
     * Rewrite resume content into structured sections.
     */
    public function rewriteResumeSubmission(Resume $resume): ResumeRewrite
    {
        $promptConfig = $this->prepareRewritePrompt($resume);
        $parsedData = $this->callGemini($promptConfig['prompt']);

        // Store the result
        $rewrite = $resume->rewrite()->updateOrCreate(
            ['resume_id' => $resume->id],
            [
                'summary' => $parsedData['summary'] ?? null,
                'experience' => $parsedData['experience'] ?? [],
                'skills' => $parsedData['skills'] ?? [],
                'education' => $parsedData['education'] ?? [],
            ]
        );

        return $rewrite;
    }

    protected function callGemini(string $prompt): array
    {
        $apiKey = env('GEMINI_API_KEY');
        $model = env('GEMINI_MODEL', 'gemini-flash-latest');

        if (empty($apiKey)) {
            Log::error('Gemini API key is missing');
            throw new Exception('Gemini API key is not configured.');
        }

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

        $response = Http::post($url, [
            'contents' => [['parts' => [['text' => $prompt]]]],
        ]);

        if ($response->failed()) {
            Log::error('Gemini API Request Failed', ['status' => $response->status(), 'body' => $response->body()]);
            throw new Exception('Failed to connect to Gemini API.');
        }

        $responseData = $response->json();
        $rawText = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? '';

        // Strip markdown
        $rawText = trim($rawText);
        $rawText = preg_replace('/^```json\s*|```$/', '', $rawText);
        $rawText = trim($rawText);

        $parsedData = json_decode($rawText, true);

        if (json_last_error() !== JSON_ERROR_NONE || ! is_array($parsedData)) {
            Log::error('JSON Parsing Failed', ['raw_text' => $rawText]);
            throw new Exception('Failed to parse AI output into valid JSON.');
        }

        return $parsedData;
    }

    protected function prepareCodePrompt(CodeSubmission $submission): array
    {
        $systemInstructions = 'You are a world-class senior software engineer and security auditor.';
        $isFixMode = $submission->mode === 'fix';
        $isExplainMode = $submission->mode === 'explain';

        if ($isFixMode) {
            $modeInstruction = "Provide a 'PRO' version of the submitted code. FIX bugs, security flaws, and improve readability while preserving intent.";
        } elseif ($isExplainMode) {
            $modeInstruction = 'Explain the logic of this code in detail. Break down how it works, what data structures are used, and any potential side effects. Be educational.';
        } else {
            $modeInstruction = 'Provide a comprehensive code review focusing on bugs, security, and performance.';
        }

        $jsonSchema = [
            'score' => 'integer (1-10)',
            'bugs' => 'array of strings',
            'improvements' => 'array of strings',
            'security_issues' => 'array of strings',
        ];

        if ($isFixMode) {
            $jsonSchema['fixed_code'] = 'string';
            $jsonSchema['fixed_explanation'] = 'string';
            $jsonSchema['fixed_improvements'] = 'array of strings';
        }

        $prompt = "{$systemInstructions}\n\n{$modeInstruction}\n\n".
                 "Analyze the following {$submission->language} code:\n".
                 "```\n{$submission->content}\n```\n\n".
                 "Respond ONLY in valid JSON with this schema:\n".json_encode($jsonSchema, JSON_PRETTY_PRINT);

        return ['prompt' => $prompt];
    }

    protected function prepareTextPrompt(TextSubmission $submission): array
    {
        $systemInstructions = 'You are a professional editor and linguist.';

        switch ($submission->mode) {
            case 'grammar': $task = 'Fix all grammar, spelling, and punctuation errors.';
                break;
            case 'rewrite': $task = 'Rephrase for clarity and impact while preserving meaning.';
                break;
            case 'summarize': $task = 'Provide a concise summary of key points.';
                break;
            case 'improve': $task = 'Enhance professional tone and flow.';
                break;
            default: $task = 'Improve the text.';
        }

        $jsonSchema = [
            'score' => 'integer (1-10)',
            'bugs' => 'array of strings (linguistic errors found)',
            'improvements' => 'array of strings (stylistic suggestions)',
            'fixed_code' => 'string (the processed text)',
            'fixed_explanation' => 'string (summary of changes)',
        ];

        $prompt = "{$systemInstructions}\n\nTask: {$task}\n\n".
                 "Input Text:\n\"\"\"\n{$submission->content}\n\"\"\"\n\n".
                 "Respond ONLY in valid JSON with this schema:\n".json_encode($jsonSchema, JSON_PRETTY_PRINT);

        return ['prompt' => $prompt];
    }

    protected function prepareResumePrompt(Resume $resume): array
    {
        $systemInstructions = 'You are an expert HR Manager and Professional Resume Writer.';
        $task = 'Analyze the resume content and provide professional feedback to optimize it for ATS and hiring managers.';

        $jsonSchema = [
            'score' => 'integer (1-10)',
            'grammar_corrections' => 'array of strings',
            'professional_improvements' => 'array of strings',
            'missing_sections' => 'array of strings',
            'skill_suggestions' => 'array of strings',
        ];

        $content = $resume->extracted_text ?: $resume->original_content;

        $prompt = "{$systemInstructions}\n\nTask: {$task}\n\n".
                 "Resume Content:\n\"\"\"\n{$content}\n\"\"\"\n\n".
                 "Respond ONLY in valid JSON with this schema:\n".json_encode($jsonSchema, JSON_PRETTY_PRINT);

        return ['prompt' => $prompt];
    }

    protected function prepareRewritePrompt(Resume $resume): array
    {
        $systemInstructions = 'You are a world-class professional resume writer and career coach.';
        $task = 'REWRITE the resume content into a high-impact, professional, and ATS-friendly format. Improve wording, clarify achievements, and ensure a consistent tone.';

        $jsonSchema = [
            'summary' => 'string (a powerful professional summary)',
            'experience' => 'array of objects with fields: role, company, duration, achievements (array of strings)',
            'skills' => 'array of strings (categorized if possible)',
            'education' => 'array of objects with fields: degree, institution, year',
        ];

        $content = $resume->extracted_text ?: $resume->original_content;

        $prompt = "{$systemInstructions}\n\nTask: {$task}\n\n".
                 "Original Content:\n\"\"\"\n{$content}\n\"\"\"\n\n".
                 "Respond ONLY in valid JSON with this schema:\n".json_encode($jsonSchema, JSON_PRETTY_PRINT);

        return ['prompt' => $prompt];
    }
}
