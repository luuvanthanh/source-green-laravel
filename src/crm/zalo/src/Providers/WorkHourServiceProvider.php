<?php

namespace GGPHP\WorkHour\Providers;

use GGPHP\WorkHour\Repositories\Contracts\WorkHourRepository;
use GGPHP\WorkHour\Repositories\Eloquent\WorkHourRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class WorkHourServiceProvider extends ServiceProvider
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
        $this->app->bind(WorkHourRepository::class, WorkHourRepositoryEloquent::class);
    }
}
