<?php

namespace GGPHP\ChildDevelop\ChildEvaluate\Providers;

use GGPHP\ChildDevelop\ChildEvaluate\Repositories\Contracts\ChildEvaluateRepository;
use GGPHP\ChildDevelop\ChildEvaluate\Repositories\Eloquent\ChildEvaluateRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class ChildEvaluateServiceProvider extends ServiceProvider
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
        $this->app->bind(ChildEvaluateRepository::class, ChildEvaluateRepositoryEloquent::class);
    }
}
