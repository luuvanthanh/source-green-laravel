<?php

namespace GGPHP\Crm\Category\Providers;

use GGPHP\Crm\Category\Repositories\Contracts\ParentPotentialRepository;
use GGPHP\Crm\Category\Repositories\Contracts\StatusParentLeadRepository;
use GGPHP\Crm\Category\Repositories\Eloquent\ParentPotentialRepositoryEloquent;
use GGPHP\Crm\Category\Repositories\Eloquent\StatusParentLeadRepositoryEloquent;
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
        $this->app->bind(StatusParentLeadRepository::class, StatusParentLeadRepositoryEloquent::class);
        $this->app->bind(ParentPotentialRepository::class, ParentPotentialRepositoryEloquent::class);
    }
}
