<?php

namespace GGPHP\Crm\Clover\Providers;

use GGPHP\Crm\Clover\Repositories\Contracts\CategoryEmployeeHrmRepository;
use GGPHP\Crm\Clover\Repositories\Contracts\EmployeeHrmRepository;
use GGPHP\Crm\Clover\Repositories\Eloquent\CategoryEmployeeHrmRepositoryEloquent;
use GGPHP\Crm\Clover\Repositories\Eloquent\EmployeeHrmRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class CloverServiceProvider extends ServiceProvider
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
        $this->app->bind(EmployeeHrmRepository::class, EmployeeHrmRepositoryEloquent::class);
    }
}
