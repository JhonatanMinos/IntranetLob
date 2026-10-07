<?php

namespace App\Http\Controllers;

use App\Services\EventService;
use App\Services\NotificationService;
use App\Services\UserService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private const SHORTCUTS = [
        'directory',
        'processes',
        'events',
        'notifications',
        'employee-files',
        'rrhh',
        'marketplace',
    ];

    public function __construct(
        private EventService $eventService,
        private NotificationService $notificationService,
        private UserService $userService,
    ) {}

    public function index(Request $request)
    {
        return Inertia::render('dashboard', [
            'events' => $this->eventService->getCurrentMonthEvents(),
            'news' => $this->notificationService->getAllNotifications()->take(3),
            'birthday' => $this->getUsersBirthday(),
            'dashboardShortcuts' => $request->user()->dashboard_shortcuts,
        ]);
    }

    public function updateShortcuts(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'shortcuts' => ['present', 'array', 'max:'.count(self::SHORTCUTS)],
            'shortcuts.*' => ['string', 'distinct', Rule::in(self::SHORTCUTS)],
        ]);

        $request->user()->update([
            'dashboard_shortcuts' => array_values($validated['shortcuts']),
        ]);

        return back()->with('success', 'Accesos directos actualizados.');
    }

    /**
     * Get users with birthday in current month onwards
     */
    private function getUsersBirthday()
    {
        $users = $this->userService->getAllUsers();

        $now = now();

        return $users->filter(function ($user) use ($now) {
            if (! $user->birthday) {
                return false;
            }

            $birthday = Carbon::parse($user->birthday);
            $birthdayThisYear = $birthday->setYear($now->year);

            return $birthdayThisYear->month === $now->month
                   && $birthdayThisYear->day >= $now->day;
        })
            ->sortBy(function ($user) {
                return Carbon::parse($user->birthday)->day;
            })
            ->values();
    }
}
