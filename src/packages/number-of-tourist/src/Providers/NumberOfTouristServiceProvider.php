<?php

namespace GGPHP\NumberOfTourist\Providers;

use GGPHP\NumberOfTourist\Repositories\Contracts\NumberOfTouristRepository;
use GGPHP\NumberOfTourist\Repositories\Eloquent\NumberOfTouristRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class NumberOfTouristServiceProvider extends ServiceProvider
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
        $this->app->bind(NumberOfTouristRepository::class, NumberOfTouristRepositoryEloquent::class);
    }
}
