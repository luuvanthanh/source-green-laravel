<?php

namespace GGPHP\Transfer\Providers;

use GGPHP\Transfer\Repositories\Contracts\TransferRepository;
use GGPHP\Transfer\Repositories\Eloquent\TransferRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class TransferServiceProvider extends ServiceProvider
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
        $this->app->bind(TransferRepository::class, TransferRepositoryEloquent::class);
    }
}
