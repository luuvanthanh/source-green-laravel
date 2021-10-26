<?php

namespace GGPHP\WorkOnline\Providers;

use GGPHP\WorkOnline\Repositories\Contracts\WorkOnlineRepository;
use GGPHP\WorkOnline\Repositories\Eloquents\WorkOnlineRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class WorkOnlineServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        if ($this->app->runningInConsole()) {
            $this->loadMigrationsFrom(__DIR__ . '/../../databases/migrations');
        }
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(WorkOnlineRepository::class, WorkOnlineRepositoryEloquent::class);
    }
}
