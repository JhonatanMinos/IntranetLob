<?php

namespace App\Http\Controllers;

use App\DTOs\NotificationDTO;
use App\Services\EventService;
use App\Services\NotificationService;
use App\Services\UserService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        private EventService $eventService,
        private NotificationService $notificationService,
        private UserService $userService,
    ) {}

    public function index()
    {
        return Inertia::render('dashboard', [
            'events' => $this->eventService->getCurrentMonthEvents(),
            'news' => $this->notificationService->getAllNotifications(),
            'birthday' => $this->getUsersBirthday(),
        ]);
    }

    /**
     * Get users with birthday in current month onwards
     */
    private function getUsersBirthday()
    {
        $users = $this->userService->getAllUsers();

        $now = now();

        return $users->filter(function ($user) use ($now) {
            if (!$user->birthday) {
                return false;
            }

            $birthday = \Carbon\Carbon::parse($user->birthday);
            $birthdayThisYear = $birthday->setYear($now->year);

            return $birthdayThisYear->month === $now->month
                   && $birthdayThisYear->day >= $now->day;
        })
        ->sortBy(function ($user) {
            return \Carbon\Carbon::parse($user->birthday)->day;
        })
        ->values();
    }
}
