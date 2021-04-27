<?php

namespace GGPHP\BusinessCard\Providers;

use GGPHP\BusinessCard\Repositories\Contracts\BusinessCardRepository;
use GGPHP\BusinessCard\Repositories\Eloquent\BusinessCardRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class BusinessCardServiceProvider extends ServiceProvider
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
        $this->app->bind(BusinessCardRepository::class, BusinessCardRepositoryEloquent::class);
    }
}
