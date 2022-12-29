<?php

namespace GGPHP\BusRegistration\Providers;

use GGPHP\BusRegistration\Repositories\Contracts\BusRegistrationRepository;
use GGPHP\BusRegistration\Repositories\Eloquent\BusRegistrationRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class BusRegistrationServiceProvider extends ServiceProvider
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
        $this->app->bind(BusRegistrationRepository::class, BusRegistrationRepositoryEloquent::class);
    }
}
