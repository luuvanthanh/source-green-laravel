<?php

namespace GGPHP\Tourist\Providers;

use GGPHP\Tourist\Repositories\Contracts\TouristRepository;
use GGPHP\Tourist\Repositories\Eloquent\TouristRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class TouristServiceProvider extends ServiceProvider
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
        $this->app->bind(TouristRepository::class, TouristRepositoryEloquent::class);
    }
}
