<?php

namespace GGPHP\Crm\CustomerPotential\Providers;

use GGPHP\Crm\CustomerPotential\Repositories\Contracts\CustomerPotentialEventInfoRepository;
use GGPHP\Crm\CustomerPotential\Repositories\Contracts\CustomerPotentialReferenceRepository;
use GGPHP\Crm\CustomerPotential\Repositories\Contracts\CustomerPotentialRepository;
use GGPHP\Crm\CustomerPotential\Repositories\Contracts\CustomerPotentialStatusCareRepository;
use GGPHP\Crm\CustomerPotential\Repositories\Eloquent\CustomerPotentialStatusCareRepositoryEloquent;
use GGPHP\Crm\CustomerPotential\Repositories\Contracts\CustomerPotentialTagRepository;
use GGPHP\Crm\CustomerPotential\Repositories\Contracts\PotentialStudentInfoRepository;
use GGPHP\Crm\CustomerPotential\Repositories\Eloquent\CustomerPotentialEventInfoRepositoryEloquent;
use GGPHP\Crm\CustomerPotential\Repositories\Eloquent\CustomerPotentialReferenceRepositoryEloquent;
use GGPHP\Crm\CustomerPotential\Repositories\Eloquent\CustomerPotentialRepositoryEloquent;
use GGPHP\Crm\CustomerPotential\Repositories\Eloquent\CustomerPotentialTagRepositoryEloquent;
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
        $this->app->bind(CustomerPotentialStatusCareRepository::class, CustomerPotentialStatusCareRepositoryEloquent::class);
        $this->app->bind(CustomerPotentialTagRepository::class, CustomerPotentialTagRepositoryEloquent::class);
        $this->app->bind(CustomerPotentialReferenceRepository::class, CustomerPotentialReferenceRepositoryEloquent::class);
    }
}
