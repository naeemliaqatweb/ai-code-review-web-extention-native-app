<?php

namespace App\Http\Controllers;

use App\Services\AiAnalysisService;
use App\Services\ResumeModuleService;
use App\Services\ResumeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ResumeController extends Controller
{
    protected $resumeService;

    protected $aiAnalysisService;

    protected $resumeModuleService;

    public function __construct(
        ResumeService $resumeService,
        AiAnalysisService $aiAnalysisService,
        ResumeModuleService $resumeModuleService
    ) {
        $this->resumeService = $resumeService;
        $this->aiAnalysisService = $aiAnalysisService;
        $this->resumeModuleService = $resumeModuleService;
    }

    /**
     * Submit a resume.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required_without:file|string',
            'file' => 'required_without:content|file|mimes:pdf,doc,docx|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $resume = $this->resumeService->submitResume(
            $request->only('content'),
            $request->file('file')
        );

        // Trigger AI analysis and rewrite
        try {
            $this->aiAnalysisService->analyzeResumeSubmission($resume);
            $this->aiAnalysisService->rewriteResumeSubmission($resume);
        } catch (\Exception $e) {
            \Log::error('Resume AI processing failed: '.$e->getMessage());
        }

        return response()->json([
            'message' => 'Resume submitted and processing started successfully',
            'data' => $resume->load(['analysis', 'rewrite']),
        ], 201);
    }

    /**
     * List user resumes.
     */
    public function index()
    {
        $resumes = $this->resumeService->getUserResumes();

        return response()->json(['data' => $resumes]);
    }

    /**
     * View specific resume detail.
     */
    public function show($id)
    {
        $resume = $this->resumeService->getResumeById($id);

        return response()->json(['data' => $resume->load(['analysis', 'rewrite'])]);
    }

    /**
     * List available templates.
     */
    public function templates()
    {
        return response()->json(['data' => $this->resumeModuleService->getTemplates()]);
    }

    /**
     * Download resume PDF.
     */
    public function download(Request $request, $id)
    {
        $resume = $this->resumeService->getResumeById($id);
        $templateSlug = $request->query('template', 'modern-minimalist');
        $styleOverride = $request->query('style');

        if ($styleOverride) {
            $styleOverride = json_decode($styleOverride, true);
        }

        try {
            $pdf = $this->resumeModuleService->generatePdf($resume, $templateSlug, $styleOverride);

            return $pdf->download("Resume-{$resume->user->name}.pdf");
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 403);
        }
    }

    /**
     * Update resume rewrite and create a new version.
     */
    public function updateRewrite(Request $request, $id)
    {
        $resume = $this->resumeService->getResumeById($id);
        $rewrite = $resume->rewrite;

        if (! $rewrite) {
            return response()->json(['error' => 'No rewrite found for this resume'], 404);
        }

        // 1. Create a version snapshot of CURRENT content before updating
        $versionNumber = $rewrite->versions()->max('version_number') ?? 0;

        $rewrite->versions()->create([
            'summary' => $rewrite->summary,
            'experience' => $rewrite->experience,
            'skills' => $rewrite->skills,
            'education' => $rewrite->education,
            'profile_image' => $rewrite->profile_image,
            'contact_details' => $rewrite->contact_details,
            'style_config' => $rewrite->style_config,
            'version_number' => $versionNumber + 1,
        ]);

        // 2. Update the main rewrite record with NEW content
        $rewrite->update($request->only([
            'summary', 'experience', 'skills', 'education',
            'profile_image', 'contact_details', 'style_config',
        ]));

        return response()->json([
            'message' => 'Resume updated successfully',
            'data' => $rewrite->refresh()->load('versions'),
        ]);
    }

    /**
     * Upload profile photo for resume.
     */
    public function uploadPhoto(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            \Log::error('Resume photo upload validation failed: ', $validator->errors()->toArray());

            return response()->json(['errors' => $validator->errors()], 422);
        }

        $resume = $this->resumeService->getResumeById($id);
        $rewrite = $resume->rewrite;

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('resume_photos', 'public');
            $rewrite->update(['profile_image' => $path]);
        }

        return response()->json([
            'message' => 'Photo uploaded successfully',
            'path' => $path,
        ]);
    }

    /**
     * Get version history for a resume rewrite.
     */
    public function history($id)
    {
        $resume = $this->resumeService->getResumeById($id);
        $rewrite = $resume->rewrite;

        if (! $rewrite) {
            return response()->json(['data' => []]);
        }

        return response()->json([
            'data' => $rewrite->versions()->orderBy('version_number', 'desc')->get(),
        ]);
    }

    /**
     * Delete a resume.
     */
    public function destroy($id)
    {
        $resume = $this->resumeService->getResumeById($id);

        // Associated modules (analysis, rewrite, etc.) should be handled by
        // cascade deletes or manually in the service if needed.
        $resume->delete();

        return response()->json([
            'message' => 'Resume deleted successfully',
        ]);
    }
}
