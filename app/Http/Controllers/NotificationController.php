<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNotificationRequest;
use App\Http\Requests\UpdateNotificationRequest;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    private function formData(): array
    {
        return [
            'priorities' => [
                ['value' => 'normal', 'label' => 'Normal', 'color' => 'bg-green-500'],
                ['value' => 'importante', 'label' => 'Importante', 'color' => 'bg-yellow-500'],
                ['value' => 'urgente', 'label' => 'Urgente', 'color' => 'bg-red-500'],
            ],
            'type' => [
                ['value' => 'aviso', 'label' => 'Aviso'],
                ['value' => 'noticia', 'label' => 'Noticia'],
                ['value' => 'articulo', 'label' => 'Articulo'],
                ['value' => 'mensaje', 'label' => 'Mensaje'],
            ],
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $searchInput = $request->search;

        $notification = $searchInput
            ? Notification::search($searchInput)->paginate(10)->withQueryString()
            : Notification::paginate(10)->withQueryString();

        return Inertia::render('notifications', [
            'data' => $notification,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Notification/form_notification', [...$this->formData()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNotificationRequest $request)
    {
        Notification::create([
            ...$request->validated(),
            'created_by' => Auth::id(),
        ]);

        return redirect()->route('notifications.index')->with('success', 'Notificacion creada correctamente');
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
        return Inertia::render('Notification/form_notification', [
            ...$this->formData(),
            'notification' => $notification]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNotificationRequest $request, Notification $notification)
    {
        $notification->update($request->validated());

        return redirect()
            ->route('notifications.index')
            ->with('success', 'Notificación actualizada correctamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Notification $notification)
    {
        $notification->delete();
        return redirect()->route('notifications.index')->with('success', 'Notification canceladad');
    }
}
