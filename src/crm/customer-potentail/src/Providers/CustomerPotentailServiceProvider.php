<?php

namespace GGPHP\Crm\CustomerPotentail\Providers;

use GGPHP\Crm\CustomerPotentail\Repositories\Contracts\CustomerPotentailRepository;
use GGPHP\Crm\CustomerPotentail\Repositories\Eloquent\CustomerPotentailRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class CustomerPotentailServiceProvider extends ServiceProvider
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
        $this->app->bind(CustomerPotentailRepository::class, CustomerPotentailRepositoryEloquent::class);
    }
}
