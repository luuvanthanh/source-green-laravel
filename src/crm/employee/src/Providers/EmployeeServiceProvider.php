<?php

namespace GGPHP\Crm\Employee\Providers;

use GGPHP\Crm\Employee\Repositories\Contracts\EmployeeRepository;
use GGPHP\Crm\Employee\Repositories\Eloquent\EmployeeRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class EmployeeServiceProvider extends ServiceProvider
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
        $this->app->bind(EmployeeRepository::class, EmployeeRepositoryEloquent::class);
    }
}
