<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CodeSubmissionResource extends JsonResource
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
            'title' => $this->title,
            'language' => $this->language,
            'content' => $this->content,
            'status' => $this->status,
            'mode' => $this->mode,
            'user' => [
                'id' => $this->user_id,
            ],
            'analysis' => new AiAnalysisResource($this->whenLoaded('analysis')),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
