<?php

namespace App\Services;

use App\Models\Resume;
use App\Models\ResumeTemplate;
use Barryvdh\DomPDF\Facade\Pdf;
use Exception;

class ResumeModuleService
{
    /**
     * Get available templates.
     */
    public function getTemplates()
    {
        return ResumeTemplate::all();
    }

    /**
     * Generate PDF for a resume using a specific template.
     */
    public function generatePdf(Resume $resume, string $templateSlug, ?array $styleOverride = null)
    {
        $template = ResumeTemplate::where('slug', $templateSlug)->firstOrFail();

        $rewrite = $resume->rewrite;
        if (! $rewrite) {
            throw new Exception('Resume has not been rewritten yet.');
        }

        // Access Control - Relaxed for demo
        if ($template->is_premium) {
            // For now, allow for testing
            // if (!auth()->user()->is_premium) { throw new Exception("..."); }
        }

        if ($styleOverride) {
            $rewrite->style_config = array_merge($rewrite->style_config ?? [], $styleOverride);
        }

        // Determine view based on slug
        $viewName = "resumes.templates.{$template->slug}";
        if (! view()->exists($viewName)) {
            $viewName = 'resumes.templates.base';
        }

        $pdf = Pdf::loadView($viewName, [
            'rewrite' => $rewrite,
            'template' => $template,
        ]);

        return $pdf;
    }
}
