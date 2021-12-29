<?php

namespace GGPHP\Notification\Providers;

use GGPHP\Notification\Repositories\Contracts\NotificationRepository;
use GGPHP\Notification\Repositories\Eloquent\NotificationRepositoryEloquent;
use Illuminate\Support\ServiceProvider;
use Illuminate\Notifications\Channels\DatabaseChannel as IlluminateDatabaseChannel;
use GGPHP\Notification\Channels\DatabaseChannel;

class NotificationServiceProvider extends ServiceProvider
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
        $this->app->instance(IlluminateDatabaseChannel::class, new DatabaseChannel());
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(NotificationRepository::class, NotificationRepositoryEloquent::class);
    }
}
