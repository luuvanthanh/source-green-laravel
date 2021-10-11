<?php

namespace GGPHP\Crm\CustomerPotential\Providers;

use GGPHP\Crm\CustomerPotential\Repositories\Contracts\CustomerPotentialEventInfoRepository;
use GGPHP\Crm\CustomerPotential\Repositories\Contracts\CustomerPotentialRepository;
use GGPHP\Crm\CustomerPotential\Repositories\Contracts\PotentialStudentInfoRepository;
use GGPHP\Crm\CustomerPotential\Repositories\Eloquent\CustomerPotentialEventInfoRepositoryEloquent;
use GGPHP\Crm\CustomerPotential\Repositories\Eloquent\CustomerPotentialRepositoryEloquent;
use GGPHP\Crm\CustomerPotential\Repositories\Eloquent\PotentialStudentInfoRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class CustomerPotentialServiceProvider extends ServiceProvider
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
        $this->app->bind(CustomerPotentialRepository::class, CustomerPotentialRepositoryEloquent::class);
        $this->app->bind(PotentialStudentInfoRepository::class, PotentialStudentInfoRepositoryEloquent::class);
        $this->app->bind(CustomerPotentialEventInfoRepository::class, CustomerPotentialEventInfoRepositoryEloquent::class);
    }
}
