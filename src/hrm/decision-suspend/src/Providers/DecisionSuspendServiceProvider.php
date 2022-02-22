<?php

namespace GGPHP\DecisionSuspend\Providers;

use GGPHP\DecisionSuspend\Repositories\Contracts\DecisionSuspendRepository;
use GGPHP\DecisionSuspend\Repositories\Eloquent\DecisionSuspendRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class DecisionSuspendServiceProvider extends ServiceProvider
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
        $this->app->bind(DecisionSuspendRepository::class, DecisionSuspendRepositoryEloquent::class);
    }
}
