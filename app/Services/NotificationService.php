<?php

namespace App\Services;

use App\DTOs\NotificationDTO;
use App\Models\Notification;
use App\Notifications\NuevaNotificacion;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

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
    public function searchNotifications(?string $search = null): LengthAwarePaginator
    {
        $query = Notification::with('creator');

        if ($search) {
            $query = Notification::search($search);
        }

        return $query->latest('published_at')
            ->paginate(10)
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
        // Procesar la imagen si existe
        if (isset($data['imagen_path']) && $data['imagen_path'] instanceof UploadedFile) {
            $imagePath = $this->storeNotificationImage($data['imagen_path']);
            $data['imagen_path'] = $imagePath;
        } else {
            // Si no hay imagen, remover la clave
            unset($data['imagen_path']);
        }

        $data['created_by'] = $createdBy;
        $notification = Notification::create($data);
        $notification->load('creator');

        $user = auth()->user();
        $user->notify(new NuevaNotificacion($notification));

        return NotificationDTO::fromModel($notification);
    }

    /**
     * Store a notification image in public/uploads/notifications
     */
    private function storeNotificationImage(UploadedFile $file): string
    {
        $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

        // Guardar en public/uploads/notifications
        $path = $file->storeAs(
            'uploads/notifications',
            $fileName,
            'public'
        );

        return '/' . $path;
    }

    /**
     * Update a notification
     */
    public function updateNotification(Notification $notification, array $data): NotificationDTO
    {
        // Procesar la imagen si existe
        if (isset($data['imagen_path']) && $data['imagen_path'] instanceof UploadedFile) {
            // Eliminar imagen anterior si existe
            if ($notification->imagen_path) {
                Storage::disk('public')->delete(ltrim($notification->imagen_path, '/'));
            }

            $imagePath = $this->storeNotificationImage($data['imagen_path']);
            $data['imagen_path'] = $imagePath;
        } elseif (isset($data['imagen_path']) && is_string($data['imagen_path'])) {
            // Si es un string, es la ruta anterior, se mantiene igual
            unset($data['imagen_path']);
        } else {
            // Si tiene imagen anterior y se intenta eliminar
            if (isset($data['imagen_path']) && $data['imagen_path'] === null && $notification->imagen_path) {
                Storage::disk('public')->delete(ltrim($notification->imagen_path, '/'));
                $data['imagen_path'] = null;
            }
        }

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
        // Eliminar imagen si existe
        if ($notification->imagen_path) {
            Storage::disk('public')->delete(ltrim($notification->imagen_path, '/'));
        }

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
