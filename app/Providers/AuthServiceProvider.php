<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;
use App\Models\Brand;
use App\Models\Company;
use App\Models\Department;
use App\Models\Event;
use App\Models\IdentityContent;
use App\Models\Notification;
use App\Models\Store;
use App\Policies\UserPolicy;
use App\Policies\BrandPolicy;
use App\Policies\CompanyPolicy;
use App\Policies\DepartmentPolicy;
use App\Policies\EventPolicy;
use App\Policies\IdentityContentPolicy;
use App\Policies\NotificationPolicy;
use App\Policies\StorePolicy;

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
        // Super Admin bypass - Super Admins can perform any action
        Gate::before(function (User $user) {
            return $user->hasRole('sa') ? true : null;
        });
    }
}
