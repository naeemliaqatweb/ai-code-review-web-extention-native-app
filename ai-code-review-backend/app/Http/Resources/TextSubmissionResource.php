<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TextSubmissionResource extends JsonResource
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
            'content' => $this->content,
            'mode' => $this->mode,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'analysis' => $this->whenLoaded('analysis', function () {
                return [
                    'score' => $this->analysis->score,
                    'bugs' => $this->analysis->bugs,
                    'improvements' => $this->analysis->improvements,
                    'processed_text' => $this->analysis->processed_text,
                    'explanation' => $this->analysis->explanation,
                ];
            }),
        ];
    }
}
