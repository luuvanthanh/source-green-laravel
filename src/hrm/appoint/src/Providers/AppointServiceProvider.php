<?php

namespace GGPHP\Appoint\Providers;

use GGPHP\Appoint\Repositories\Contracts\AppointRepository;
use GGPHP\Appoint\Repositories\Eloquent\AppointRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class AppointServiceProvider extends ServiceProvider
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
        $this->app->bind(AppointRepository::class, AppointRepositoryEloquent::class);
    }
}
