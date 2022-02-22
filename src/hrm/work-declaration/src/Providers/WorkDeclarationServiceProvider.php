<?php

namespace GGPHP\WorkDeclaration\Providers;

use GGPHP\WorkDeclaration\Repositories\Contracts\WorkDeclarationRepository;
use GGPHP\WorkDeclaration\Repositories\Eloquent\WorkDeclarationRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class WorkDeclarationServiceProvider extends ServiceProvider
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
        $this->app->bind(WorkDeclarationRepository::class, WorkDeclarationRepositoryEloquent::class);
    }
}
