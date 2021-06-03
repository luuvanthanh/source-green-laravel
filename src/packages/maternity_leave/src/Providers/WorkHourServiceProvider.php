<?php

namespace GGPHP\MaternityLeave\Providers;

use GGPHP\MaternityLeave\Repositories\Contracts\MaternityLeaveRepository;
use GGPHP\MaternityLeave\Repositories\Eloquent\MaternityLeaveRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class MaternityLeaveServiceProvider extends ServiceProvider
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
        $this->app->bind(MaternityLeaveRepository::class, MaternityLeaveRepositoryEloquent::class);
    }
}
