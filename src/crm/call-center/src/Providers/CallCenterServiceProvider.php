<?php

namespace GGPHP\Crm\CallCenter\Providers;

use GGPHP\Crm\CallCenter\Repositories\Contracts\ExtensionRepository;
use GGPHP\Crm\CallCenter\Repositories\Contracts\HistoryCallRepository;
use GGPHP\Crm\CallCenter\Repositories\Contracts\ManagerCallRepository;
use GGPHP\Crm\CallCenter\Repositories\Eloquent\ExtensionRepositoryEloquent;
use GGPHP\Crm\CallCenter\Repositories\Eloquent\HistoryCallRepositoryEloquent;
use GGPHP\Crm\CallCenter\Repositories\Eloquent\ManagerCallRepositoryEloquent;
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
        $this->app->bind(HistoryCallRepository::class, HistoryCallRepositoryEloquent::class);
        $this->app->bind(ManagerCallRepository::class, ManagerCallRepositoryEloquent::class);
        $this->app->bind(ExtensionRepository::class, ExtensionRepositoryEloquent::class);
    }
}
