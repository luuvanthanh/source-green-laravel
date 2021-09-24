<?php

namespace GGPHP\Crm\Category\Providers;

use GGPHP\Crm\Category\Repositories\Contracts\SearchSourceRepository;
use GGPHP\Crm\Category\Repositories\Contracts\StatusParentPotentialRepository;
use GGPHP\Crm\Category\Repositories\Eloquent\StatusParentPotentialRepositoryEloquent;
use GGPHP\Crm\Category\Repositories\Contracts\StatusParentLeadRepository;
use GGPHP\Crm\Category\Repositories\Eloquent\SearchSourceRepositoryEloquent;
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
        $this->app->bind(StatusParentPotentialRepository::class, StatusParentPotentialRepositoryEloquent::class);
        $this->app->bind(StatusParentLeadRepository::class, StatusParentLeadRepositoryEloquent::class);
        $this->app->bind(SearchSourceRepository::class, SearchSourceRepositoryEloquent::class);

    }
}
