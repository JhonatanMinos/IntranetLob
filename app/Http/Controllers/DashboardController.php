<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Notification;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();

        return Inertia::render('dashboard', [
            'events' => Event::whereMonth('start_date', $now->month)
                ->whereYear('start_date', $now->year)
                ->orderBy('start_date')
                ->get(),
            'new' => Notification::latest()->take(5)->get(),
            'birthday' => User::whereMonth('birthday', $now->month)
                ->whereDay('birthday', '>=', $now->day)
                ->orderByRaw("strftime('%d', birthday)")
                ->get()
        ]);
    }
}
