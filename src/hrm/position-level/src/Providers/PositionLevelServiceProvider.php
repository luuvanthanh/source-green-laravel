<?php

namespace GGPHP\PositionLevel\Providers;

use GGPHP\PositionLevel\Repositories\Contracts\PositionLevelRepository;
use GGPHP\PositionLevel\Repositories\Eloquent\PositionLevelRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class PositionLevelServiceProvider extends ServiceProvider
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
        $this->app->bind(PositionLevelRepository::class, PositionLevelRepositoryEloquent::class);
    }
}
