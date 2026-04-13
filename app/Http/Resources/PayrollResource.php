<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayrollResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'period_start'    => $this->period_start->format('d/m/Y'),
            'period_end'      => $this->period_end->format('d/m/Y'),
            'period_type'     => $this->period_type,
            'zip_original_name' => $this->zip_original_name,
            'status'          => $this->status,
            'progress'        => $this->progress,
            'total_files'     => $this->total_files,
            'processed_files' => $this->processed_files,
            'error_message'   => $this->error_message,
            'uploader'        => $this->uploader->name,
            'created_at'      => $this->created_at->format('d/m/Y H:i'),

        ];
    }
}
