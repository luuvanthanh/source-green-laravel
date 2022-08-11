<?php

namespace GGPHP\TravelAgency\Providers;

use GGPHP\TravelAgency\Repositories\Contracts\TravelAgencyRepository;
use GGPHP\TravelAgency\Repositories\Eloquent\TravelAgencyRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class TravelAgencyServiceProvider extends ServiceProvider
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
        $this->app->bind(TravelAgencyRepository::class, TravelAgencyRepositoryEloquent::class);
    }
}
