<?php

namespace GGPHP\Dismissed\Providers;

use GGPHP\Dismissed\Repositories\Contracts\DismissedRepository;
use GGPHP\Dismissed\Repositories\Eloquent\DismissedRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class DismissedServiceProvider extends ServiceProvider
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
        $this->app->bind(DismissedRepository::class, DismissedRepositoryEloquent::class);
    }
}
