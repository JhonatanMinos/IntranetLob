<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
                'avatar_url' => $request->user()?->avatar_path
                ? asset('storage/' . $request->user()->avatar_path)
                : null,
                'roles' => $request->user()?->getRoleNames(),
            ],
            'permissions' => $request->user() ? $request->user()->getAllPermissions()->pluck('name')->toArray() : [],
            'notifications' => $request->user()?->unreadNotifications->map(fn($n) => [
                'id'      => $n->id,
                'data'    => $n->data,
                'read_at' => $n->read_at,
            ]),
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
