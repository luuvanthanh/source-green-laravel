<?php

namespace GGPHP\Salary\Providers;

use GGPHP\Salary\Repositories\Contracts\PayrollRepository;
use GGPHP\Salary\Repositories\Eloquent\PayrollRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class SalaryServiceProvider extends ServiceProvider
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
        $this->app->bind(PayrollRepository::class, PayrollRepositoryEloquent::class);
    }
}
