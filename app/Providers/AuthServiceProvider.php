<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;
use App\Policies\UserPolicy;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        User::class => UserPolicy::class,
    ];

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Super Admin bypass
        Gate::before(function (User $user) {
            return $user->hasRole('sa') ? true : null;
        });
    }
}
