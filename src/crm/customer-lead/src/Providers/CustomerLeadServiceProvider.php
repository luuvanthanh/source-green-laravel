<?php

namespace GGPHP\Crm\CustomerLead\Providers;

use GGPHP\Crm\CustomerLead\Repositories\Contracts\CustomerLeadRepository;
use GGPHP\Crm\CustomerLead\Repositories\Eloquent\CustomerLeadRepositoryEloquent;
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
        $this->app->bind(CustomerLeadRepository::class, CustomerLeadRepositoryEloquent::class);
    }
}
