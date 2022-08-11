<?php

namespace GGPHP\SystemConfig\Providers;

use GGPHP\SystemConfig\Repositories\Contracts\SystemConfigRepository;
use GGPHP\SystemConfig\Repositories\Eloquent\SystemConfigRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class SystemConfigServiceProvider extends ServiceProvider
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
        $this->app->bind(SystemConfigRepository::class, SystemConfigRepositoryEloquent::class);
    }
}
