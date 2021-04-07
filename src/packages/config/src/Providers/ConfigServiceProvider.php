<?php

namespace GGPHP\Config\Providers;

use GGPHP\Config\Repositories\Contracts\ConfigRepository;
use GGPHP\Config\Repositories\Eloquent\ConfigRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class ConfigServiceProvider extends ServiceProvider
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
        $this->app->bind(ConfigRepository::class, ConfigRepositoryEloquent::class);
    }
}
