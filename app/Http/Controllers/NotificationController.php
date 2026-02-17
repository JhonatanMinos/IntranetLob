<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNotificationRequest;
use App\Http\Requests\UpdateNotificationRequest;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
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
            'data' => $notification
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $priorities = [
            [
                'value' => 'normal',
                'label' => 'Normal',
                'color' => 'bg-green-500',
            ],
            [
                'value' => 'importante',
                'label' => 'Importante',
                'color' => 'bg-yellow-500',
            ],
            [
                'value' => 'urgente',
                'label' => 'Urgente',
                'color' => 'bg-red-500',
            ],
        ];

        $type = [
            [
                'value' => "aviso",
                'label' => "Aviso",
            ],
            [
                'value' => "noticia",
                'label' => "Noticia",
            ],
            [
                'value' => "articulo",
                'label' => "Articulo",
            ],
            [
                'value' => "mensaje",
                'label' => 'Mensaje',
            ]
        ];

        return Inertia::render('Notification/form_notification', [
            'priorities' => $priorities,
            'type' => $type
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNotificationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Notification $notification)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Notification $notification)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNotificationRequest $request, Notification $notification)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Notification $notification)
    {
        //
    }
}
