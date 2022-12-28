<?php

namespace GGPHP\ConfigReceiveNotification\Providers;

use GGPHP\ConfigReceiveNotification\Repositories\Contracts\ConfigReceiveNotificationRepository;
use GGPHP\ConfigReceiveNotification\Repositories\Eloquent\ConfigReceiveNotificationRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class ConfigReceiveNotificationServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        if ($this->app->runningInConsole()) {
            $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations');
        }
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(ConfigReceiveNotificationRepository::class, ConfigReceiveNotificationRepositoryEloquent::class);
    }
}
