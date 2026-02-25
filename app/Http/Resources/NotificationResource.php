<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
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
            'subject' => $this->subject,
            'content' => $this->content,
            'imagenPath' => $this->imagenPath,
            'priority' => $this->priority,
            'type' => $this->type,
            'createdBy' => $this->createdBy,
            'creatorName' => $this->creatorName,
            'publishedAt' => $this->publishedAt,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
            'deletedAt' => $this->deletedAt,
        ];
    }
}
