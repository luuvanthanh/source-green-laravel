<?php

namespace GGPHP\ExpectedTime\Providers;

use GGPHP\ExpectedTime\Repositories\Contracts\ExpectedTimeRepository;
use GGPHP\ExpectedTime\Repositories\Eloquent\ExpectedTimeRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class ExpectedTimeServiceProvider extends ServiceProvider
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
        $this->app->bind(ExpectedTimeRepository::class, ExpectedTimeRepositoryEloquent::class);
    }
}
