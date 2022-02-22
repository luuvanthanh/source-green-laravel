<?php

namespace GGPHP\SalaryIncrease\Providers;

use GGPHP\SalaryIncrease\Repositories\Contracts\SalaryIncreaseRepository;
use GGPHP\SalaryIncrease\Repositories\Eloquent\SalaryIncreaseRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class SalaryIncreaseServiceProvider extends ServiceProvider
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
        $this->app->bind(SalaryIncreaseRepository::class, SalaryIncreaseRepositoryEloquent::class);
    }
}
