<?php

namespace GGPHP\ResignationDecision\Providers;

use GGPHP\ResignationDecision\Repositories\Contracts\ResignationDecisionRepository;
use GGPHP\ResignationDecision\Repositories\Eloquent\ResignationDecisionRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class ResignationDecisionServiceProvider extends ServiceProvider
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
        $this->app->bind(ResignationDecisionRepository::class, ResignationDecisionRepositoryEloquent::class);
    }
}
