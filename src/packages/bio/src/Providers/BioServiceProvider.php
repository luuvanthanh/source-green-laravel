<?php

namespace GGPHP\Bio\Providers;

use GGPHP\Bio\Repositories\Contracts\BioRepository;
use GGPHP\Bio\Repositories\Eloquent\BioRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class BioServiceProvider extends ServiceProvider
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
        $this->app->bind(BioRepository::class, BioRepositoryEloquent::class);
    }
}
