<?php

namespace App\Providers;

use App\Models\Brand;
use App\Models\Company;
use App\Models\Department;
use App\Models\Event;
use App\Models\IdentityContent;
use App\Models\Notification;
use App\Models\Store;
use App\Models\User;
use App\Policies\BrandPolicy;
use App\Policies\CompanyPolicy;
use App\Policies\DepartmentPolicy;
use App\Policies\EventPolicy;
use App\Policies\IdentityContentPolicy;
use App\Policies\NotificationPolicy;
use App\Policies\StorePolicy;
use App\Policies\UserPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        User::class => UserPolicy::class,
        Brand::class => BrandPolicy::class,
        Company::class => CompanyPolicy::class,
        Department::class => DepartmentPolicy::class,
        Event::class => EventPolicy::class,
        IdentityContent::class => IdentityContentPolicy::class,
        Notification::class => NotificationPolicy::class,
        Store::class => StorePolicy::class,
    ];

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Gate::define('view-processes', fn (User $user) => $user->hasAnyRole(['sa', 'rh', 'user']));
        Gate::define('manage-processes', fn (User $user) => $user->hasRole('sa') || $user->getAllPermissions()->contains('name', 'manage processes'));

        // Super Admin bypass - Super Admins can perform any action
        Gate::before(function (User $user) {
            return $user->hasRole('sa') ? true : null;
        });
    }
}
