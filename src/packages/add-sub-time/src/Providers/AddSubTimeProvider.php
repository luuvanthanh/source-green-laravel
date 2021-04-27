<?php

namespace GGPHP\AddSubTime\Providers;

use GGPHP\AddSubTime\Repositories\Contracts\AddSubTimeRepository;
use GGPHP\AddSubTime\Repositories\Eloquent\AddSubTimeRepositoryEloquent;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as AuthServiceProvider;

class AddSubTimeProvider extends AuthServiceProvider
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
        $this->app->bind(AddSubTimeRepository::class, AddSubTimeRepositoryEloquent::class);
    }
}
