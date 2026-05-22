<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AiAnalysisResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'submission' => new CodeSubmissionResource($this->whenLoaded('codeSubmission')),
            'bugs' => $this->bugs,
            'improvements' => $this->improvements,
            'security_issues' => $this->security_issues,
            'score' => $this->score,
            'fixed_code' => $this->fixed_code,
            'fixed_explanation' => $this->fixed_explanation,
            'fixed_improvements' => $this->fixed_improvements,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
