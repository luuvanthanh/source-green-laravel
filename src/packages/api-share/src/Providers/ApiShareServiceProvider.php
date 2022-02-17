<?php

namespace GGPHP\ApiShare\Providers;

use GGPHP\ApiShare\Repositories\Contracts\ApiShareRepository;
use GGPHP\ApiShare\Repositories\Eloquent\ApiShareRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class ApiShareServiceProvider extends ServiceProvider
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
        $this->app->bind(ApiShareRepository::class, ApiShareRepositoryEloquent::class);
    }
}
