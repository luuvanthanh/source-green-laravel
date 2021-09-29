<?php

namespace GGPHP\Crm\CustomerLead\Providers;

use GGPHP\Crm\CustomerLead\Repositories\Contracts\EventInfoRepository;
use GGPHP\Crm\CustomerLead\Repositories\Eloquent\EventInfoRepositoryEloquent;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\CustomerLeadRepository;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\CustomerTagRepository;
use GGPHP\Crm\CustomerLead\Repositories\Eloquent\CustomerLeadRepositoryEloquent;
use GGPHP\Crm\CustomerLead\Repositories\Eloquent\CustomerTagRepositoryEloquent;
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
        $this->app->bind(CustomerLeadRepository::class, CustomerLeadRepositoryEloquent::class);
        $this->app->bind(CustomerTagRepository::class, CustomerTagRepositoryEloquent::class);
    }
}
