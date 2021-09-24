<?php

namespace GGPHP\Crm\Category\Providers;

use GGPHP\Crm\Category\Repositories\Contracts\StatusParentPotentialRepository;
use GGPHP\Crm\Category\Repositories\Eloquent\StatusParentPotentialRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class CategoryServiceProvider extends ServiceProvider
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
        $this->app->bind(StatusParentPotentialRepository::class, StatusParentPotentialRepositoryEloquent::class);
    }
}
