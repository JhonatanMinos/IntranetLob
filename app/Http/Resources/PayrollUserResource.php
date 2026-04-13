<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayrollUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'file_path'         => $this->file_path,
            'original_name'     => $this->original_name,
            'mime_type'         => $this->mime_type,
            'file_size'         => $this->file_size,
            'user_id'           => $this->user_id,
            'name'              => $this->employee->name,
            'processed'         => $this->processed,
            'created_at'        => $this->created_at->format('d/m/Y'),
            'updated_at'        => $this->updated_at->format('d/m/Y'),
        ];
    }
}
