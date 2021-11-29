<?php

namespace GGPHP\Crm\Icon\Providers;

use GGPHP\Crm\Icon\Repositories\Contracts\CategoryIconRepository;
use GGPHP\Crm\Icon\Repositories\Contracts\IconRepository;
use GGPHP\Crm\Icon\Repositories\Eloquent\CategoryIconRepositoryEloquent;
use GGPHP\Crm\Icon\Repositories\Eloquent\IconRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class IconServiceProvider extends ServiceProvider
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
        $this->app->bind(IconRepository::class, IconRepositoryEloquent::class);
        $this->app->bind(CategoryIconRepository::class, CategoryIconRepositoryEloquent::class);
    }
}
