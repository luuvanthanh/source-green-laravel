<?php

namespace GGPHP\RevokeShift\Providers;

use GGPHP\RevokeShift\Repositories\Contracts\RevokeShiftRepository;
use GGPHP\RevokeShift\Repositories\Eloquent\RevokeShiftRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class RevokeShiftServiceProvider extends ServiceProvider
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
        $this->app->bind(RevokeShiftRepository::class, RevokeShiftRepositoryEloquent::class);
    }
}
