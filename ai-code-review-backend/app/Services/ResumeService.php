<?php

namespace App\Services;

use App\Models\Resume;
use Exception;
use Illuminate\Http\UploadedFile;
use PhpOffice\PhpWord\IOFactory;
use Smalot\PdfParser\Parser as PdfParser;

class ResumeService
{
    /**
     * Submit a resume (text or file).
     */
    public function submitResume(array $data, ?UploadedFile $file = null)
    {
        $filePath = null;
        $extractedText = $data['content'] ?? null;

        if ($file) {
            $filePath = $file->store('resumes', 'public');
            $extractedText = $this->extractTextFromFile(storage_path('app/public/'.$filePath));
        }

        return Resume::create([
            'user_id' => auth()->id(),
            'original_content' => $data['content'] ?? null,
            'file_path' => $filePath,
            'extracted_text' => $extractedText,
            'status' => 'pending',
        ]);
    }

    /**
     * Extract text from PDF or DOCX file.
     */
    public function extractTextFromFile(string $fullPath): ?string
    {
        $extension = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));

        try {
            if ($extension === 'pdf') {
                $parser = new PdfParser;
                $pdf = $parser->parseFile($fullPath);

                return $pdf->getText();
            }

            if (in_array($extension, ['doc', 'docx'])) {
                $phpWord = IOFactory::load($fullPath);
                $text = '';
                foreach ($phpWord->getSections() as $section) {
                    foreach ($section->getElements() as $element) {
                        if (method_exists($element, 'getText')) {
                            $text .= $element->getText()."\n";
                        } elseif (method_exists($element, 'getElements')) {
                            // Handle table or nested elements if needed
                            foreach ($element->getElements() as $childElement) {
                                if (method_exists($childElement, 'getText')) {
                                    $text .= $childElement->getText().' ';
                                }
                            }
                            $text .= "\n";
                        }
                    }
                }

                return trim($text);
            }
        } catch (Exception $e) {
            \Log::error("Text extraction failed for {$extension}: ".$e->getMessage());
        }

        return null;
    }

    /**
     * Get all resumes for the authenticated user.
     */
    public function getUserResumes()
    {
        return Resume::where('user_id', auth()->id())
            ->with(['analysis', 'rewrite'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get a specific resume by ID.
     */
    public function getResumeById($id)
    {
        return Resume::where('user_id', auth()->id())
            ->findOrFail($id);
    }
}
