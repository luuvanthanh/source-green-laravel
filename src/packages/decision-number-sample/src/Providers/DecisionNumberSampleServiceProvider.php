<?php

namespace GGPHP\DecisionNumberSample\Providers;

use GGPHP\DecisionNumberSample\Repositories\Contracts\DecisionNumberSampleRepository;
use GGPHP\DecisionNumberSample\Repositories\Eloquent\DecisionNumberSampleRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class DecisionNumberSampleServiceProvider extends ServiceProvider
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
        $this->app->bind(DecisionNumberSampleRepository::class, DecisionNumberSampleRepositoryEloquent::class);
    }
}
