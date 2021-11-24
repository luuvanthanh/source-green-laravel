<?php

namespace GGPHP\Event\Providers;

use GGPHP\Event\Repositories\Contracts\EventRepository;
use GGPHP\Event\Repositories\Eloquent\EventRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class EventServiceProvider extends ServiceProvider
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
        $this->app->bind(EventRepository::class, EventRepositoryEloquent::class);
    }
}
