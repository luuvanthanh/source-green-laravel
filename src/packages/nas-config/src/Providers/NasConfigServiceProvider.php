<?php

namespace GGPHP\NasConfig\Providers;

use GGPHP\NasConfig\Repositories\Contracts\NasConfigRepository;
use GGPHP\NasConfig\Repositories\Eloquent\NasConfigRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class NasConfigServiceProvider extends ServiceProvider
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
        $this->app->bind(NasConfigRepository::class, NasConfigRepositoryEloquent::class);
    }
}
