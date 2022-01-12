<?php

namespace GGPHP\Tariff\ConfigContent\Providers;

use GGPHP\Tariff\ConfigContent\Repositories\ConfigContentRepository;
use GGPHP\Tariff\ConfigContent\Repositories\Eloquent\ConfigContentRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class ConfigContentServiceProvider extends ServiceProvider
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
        $this->app->bind(ConfigContentRepository::class, ConfigContentRepositoryEloquent::class);
    }
}
