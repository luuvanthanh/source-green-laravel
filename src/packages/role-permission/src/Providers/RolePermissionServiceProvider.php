<?php

namespace GGPHP\RolePermission\Providers;

use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\ServiceProvider;

class RolePermissionServiceProvider extends ServiceProvider
{
    public function boot(Filesystem $filesystem)
    {
        $this->loadTranslationsFrom(__DIR__ . '/../../resources/lang', 'lang-role-permission');
        if ($this->app->runningInConsole()) {
            $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations');
        }

        $this->mergeConfigFrom(
            __DIR__ . '/../../config/config.php',
            'constants'
        );
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(\GGPHP\RolePermission\Repositories\Contracts\RoleRepository::class, \GGPHP\RolePermission\Repositories\Eloquent\RoleRepositoryEloquent::class);
        $this->app->bind(\GGPHP\RolePermission\Repositories\Contracts\PermissionRepository::class, \GGPHP\RolePermission\Repositories\Eloquent\PermissionRepositoryEloquent::class);
        //:end-bindings:
    }
}
