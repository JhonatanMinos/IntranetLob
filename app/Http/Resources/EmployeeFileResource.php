<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeFileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                      => $this->id,
            'emergency_contact_name'  => $this->emergency_contact_name,
            'emergency_contact_phone' => $this->emergency_contact_phone,
            'documents'               => $this->documents,
            'user'                    => [
                'id'   => $this->user?->id,
                'name' => $this->user?->name,
                'position' => $this->user?->position,
            ],
            'update' => $this->updated_at,
        ];
    }
}
