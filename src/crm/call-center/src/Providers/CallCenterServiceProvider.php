<?php

namespace GGPHP\Crm\CallCenter\Providers;

use GGPHP\Crm\CallCenter\Repositories\Contracts\CallCenterRepository;
use GGPHP\Crm\CallCenter\Repositories\Eloquent\CallCenterRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class CallCenterServiceProvider extends ServiceProvider
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
        $this->app->bind(CallCenterRepository::class, CallCenterRepositoryEloquent::class);
    }
}
