<?php

namespace App\DTOs;

class EventDTO
{
    public function __construct(
        public int $id,
        public string $title,
        public string $type,
        public string $startDate,
        public ?string $endDate = null,
        public bool $allDay = true,
        public ?string $createdAt = null,
        public ?string $updatedAt = null,
        public ?string $deletedAt = null,
    ) {}

    /**
     * Create DTO from an Event model
     */
    public static function fromModel($event): self
    {
        return new self(
            id: $event->id,
            title: $event->title,
            type: $event->type,
            startDate: $event->start_date instanceof \DateTime 
                ? $event->start_date->format('Y-m-d')
                : $event->start_date,
            endDate: $event->end_date instanceof \DateTime
                ? $event->end_date->format('Y-m-d')
                : $event->end_date,
            allDay: (bool)$event->all_day,
            createdAt: $event->created_at?->toIso8601String(),
            updatedAt: $event->updated_at?->toIso8601String(),
            deletedAt: $event->deleted_at?->toIso8601String(),
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
            'type' => $this->type,
            'startDate' => $this->startDate,
            'endDate' => $this->endDate,
            'allDay' => $this->allDay,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
            'deletedAt' => $this->deletedAt,
        ];
    }
}
