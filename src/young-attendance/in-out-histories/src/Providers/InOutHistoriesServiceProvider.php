<?php

namespace GGPHP\InOutHistories\Providers;

use GGPHP\InOutHistories\Repositories\Contracts\InOutHistoriesRepository;
use GGPHP\InOutHistories\Repositories\Eloquent\InOutHistoriesRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class InOutHistoriesServiceProvider extends ServiceProvider
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
        $this->app->bind(InOutHistoriesRepository::class, InOutHistoriesRepositoryEloquent::class);
    }
}
