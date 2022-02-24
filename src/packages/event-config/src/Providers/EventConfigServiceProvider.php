<?php

namespace GGPHP\EventConfig\Providers;

use GGPHP\EventConfig\Repositories\Contracts\EventConfigRepository;
use GGPHP\EventConfig\Repositories\Eloquent\EventConfigRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class EventConfigServiceProvider extends ServiceProvider
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
        $this->app->bind(EventConfigRepository::class, EventConfigRepositoryEloquent::class);
    }
}
