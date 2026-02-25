<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNotificationRequest;
use App\Http\Requests\UpdateNotificationRequest;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function __construct(private NotificationService $notificationService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Notification::class);

        $searchInput = $request->search;
        $notifications = $this->notificationService->searchNotifications($searchInput);
        return Inertia::render('notifications', [
            'data' => $notifications,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Notification::class);

        return Inertia::render('Notification/form_notification', [
            ...$this->notificationService->getFormData(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNotificationRequest $request)
    {
        $this->authorize('create', Notification::class);

        $this->notificationService->createNotification(
            $request->validated(),
            Auth::id()
        );

        return redirect()->route('notifications.index')->with('success', 'Notificación creada correctamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(Notification $notification)
    {
        abort(404);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Notification $notification)
    {
        $this->authorize('update', $notification);

        return Inertia::render('Notification/form_notification', [
            ...$this->notificationService->getFormData(),
            'notification' => $this->notificationService->getNotificationById($notification->id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNotificationRequest $request, Notification $notification)
    {
        $this->authorize('update', $notification);

        $this->notificationService->updateNotification($notification, $request->validated());

        return redirect()
            ->route('notifications.index')
            ->with('success', 'Notificación actualizada correctamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Notification $notification)
    {
        $this->authorize('delete', $notification);

        $this->notificationService->deleteNotification($notification);

        return redirect()->route('notifications.index')->with('success', 'Notificación eliminada correctamente');
    }
}
