<?php

namespace App\Services;

use App\DTOs\NotificationDTO;
use App\Models\Notification;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class NotificationService
{
    /**
     * Get notification form data (choices)
     */
    public function getFormData(): array
    {
        return [
            'priorities' => [
                ['value' => 'normal', 'label' => 'Normal', 'color' => 'bg-green-500'],
                ['value' => 'importante', 'label' => 'Importante', 'color' => 'bg-yellow-500'],
                ['value' => 'urgente', 'label' => 'Urgente', 'color' => 'bg-red-500'],
            ],
            'types' => [
                ['value' => 'aviso', 'label' => 'Aviso'],
                ['value' => 'noticia', 'label' => 'Noticia'],
                ['value' => 'articulo', 'label' => 'Articulo'],
                ['value' => 'mensaje', 'label' => 'Mensaje'],
            ],
        ];
    }

    /**
     * Search notifications
     */
    public function searchNotifications(?string $search = null, int $page = 1, int $perPage = 10): LengthAwarePaginator
    {
        $query = Notification::with('creator');

        if ($search) {
            $query = Notification::search($search);
        }

        return $query->latest('published_at')
            ->paginate($perPage, ['*'], 'page', $page)
            ->through(fn($notification) => NotificationDTO::fromModel($notification)->toArray())
            ->withQueryString();
    }

    /**
     * Get all notifications
     */
    public function getAllNotifications(): \Illuminate\Database\Eloquent\Collection
    {
        return Notification::with('creator')
            ->latest('published_at')
            ->get();
    }

    /**
     * Get a notification by ID
     */
    public function getNotificationById(int $id): ?NotificationDTO
    {
        $notification = Notification::with('creator')->find($id);
        return $notification ? NotificationDTO::fromModel($notification) : null;
    }

    /**
     * Create a new notification
     */
    public function createNotification(array $data, int $createdBy): NotificationDTO
    {
        $data['created_by'] = $createdBy;

        $notification = Notification::create($data);
        $notification->load('creator');

        return NotificationDTO::fromModel($notification);
    }

    /**
     * Update a notification
     */
    public function updateNotification(Notification $notification, array $data): NotificationDTO
    {
        $notification->update($data);
        $notification->load('creator');

        return NotificationDTO::fromModel($notification);
    }

    /**
     * Publish a notification
     */
    public function publishNotification(Notification $notification): NotificationDTO
    {
        $notification->update(['published_at' => now()]);
        $notification->load('creator');

        return NotificationDTO::fromModel($notification);
    }

    /**
     * Delete a notification
     */
    public function deleteNotification(Notification $notification): bool
    {
        return $notification->delete();
    }

    /**
     * Convert notifications collection to DTOs
     */
    public function toNotificationDTOs(\Illuminate\Database\Eloquent\Collection $notifications): array
    {
        return $notifications->map(fn($n) => NotificationDTO::fromModel($n))->toArray();
    }
}
