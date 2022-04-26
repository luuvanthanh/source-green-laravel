<?php

namespace GGPHP\ManualCalculation\Providers;

use GGPHP\ManualCalculation\Repositories\Contracts\ManualCalculationRepository;
use GGPHP\ManualCalculation\Repositories\Eloquent\ManualCalculationRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class ManualCalculationServiceProvider extends ServiceProvider
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
        $this->app->bind(ManualCalculationRepository::class, ManualCalculationRepositoryEloquent::class);
    }
}
