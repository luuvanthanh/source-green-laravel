<?php

namespace GGPHP\OtherDeclaration\Providers;

use GGPHP\OtherDeclaration\Repositories\Contracts\OtherDeclarationRepository;
use GGPHP\OtherDeclaration\Repositories\Eloquent\OtherDeclarationRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class OtherDeclarationServiceProvider extends ServiceProvider
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
        $this->app->bind(OtherDeclarationRepository::class, OtherDeclarationRepositoryEloquent::class);
    }
}
