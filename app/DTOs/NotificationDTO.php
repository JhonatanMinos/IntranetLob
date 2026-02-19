<?php

namespace App\DTOs;

class NotificationDTO
{
    public function __construct(
        public int $id,
        public string $title,
        public string $content,
        public string $priority,
        public string $type,
        public int $createdBy,
        public ?string $creatorName = null,
        public ?string $publishedAt = null,
        public ?string $createdAt = null,
        public ?string $updatedAt = null,
        public ?string $deletedAt = null,
    ) {}

    /**
     * Create DTO from a Notification model
     */
    public static function fromModel($notification): self
    {
        return new self(
            id: $notification->id,
            title: $notification->title,
            content: $notification->content,
            priority: $notification->priority,
            type: $notification->type,
            createdBy: $notification->created_by,
            creatorName: $notification->creator?->name,
            publishedAt: $notification->published_at?->toIso8601String(),
            createdAt: $notification->created_at?->toIso8601String(),
            updatedAt: $notification->updated_at?->toIso8601String(),
            deletedAt: $notification->deleted_at?->toIso8601String(),
        );
    }

    /**
     * Convert DTO to array for JSON response
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
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
