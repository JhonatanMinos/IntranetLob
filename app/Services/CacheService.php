<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class CacheService
{
    private const CACHE_TTL = 3600; // 1 hora

    /**
     * Cache queries con clave personalizada
     */
    public static function rememberQuery(string $key, callable $callback)
    {
        return Cache::remember($key, self::CACHE_TTL, $callback);
    }

    /**
     * Invalidar cache por patrón
     */
    public static function forgetPattern(string $pattern): void
    {
        $keys = Cache::store('redis')->getRedis()->keys("*{$pattern}*");
        foreach ($keys as $key) {
            Cache::forget(str_replace(Cache::getPrefix(), '', $key));
        }
    }

    /**
     * Cache de usuarios activos
     */
    public static function getActiveUsers()
    {
        return self::rememberQuery('active_users', function () {
            return \App\Models\User::where('active', true)->get();
        });
    }

    /**
     * Limpiar toda la cache del proyecto
     */
    public static function clearAll(): void
    {
        Cache::flush();
    }
}