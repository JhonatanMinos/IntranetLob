<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CacheInvalidator
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Invalidar solo consultas afectadas; flush también borraba límites de login.
        if (! $request->isMethodSafe() && $response->getStatusCode() < 400 && ! $request->session()->has('errors')) {
            if ($request->routeIs('users.*', 'profile.update', 'profile.destroy', 'departament.*', 'company.*', 'shops.*')) {
                foreach (['all_users_with_relations', 'active_users'] as $key) {
                    Cache::forget($key);
                }
            }
        }

        return $response;
    }
}
