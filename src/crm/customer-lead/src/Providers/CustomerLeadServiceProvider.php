<?php

namespace GGPHP\Crm\CustomerLead\Providers;

use GGPHP\Crm\CustomerLead\Repositories\Contracts\SearchSourceRepository;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\EventInfoRepository;
use GGPHP\Crm\CustomerLead\Repositories\Eloquent\EventInfoRepositoryEloquent;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\StatusParentLeadRepository;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\TagRepository;
use GGPHP\Crm\CustomerLead\Repositories\Eloquent\SearchSourceRepositoryEloquent;
use GGPHP\Crm\CustomerLead\Repositories\Eloquent\StatusParentLeadRepositoryEloquent;
use GGPHP\Crm\CustomerLead\Repositories\Eloquent\TagRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class CustomerLeadServiceProvider extends ServiceProvider
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
        $this->app->bind(EventInfoRepository::class, EventInfoRepositoryEloquent::class);
    }
}
