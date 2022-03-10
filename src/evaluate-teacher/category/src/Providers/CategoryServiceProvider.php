<?php

namespace GGPHP\EvaluateTeacher\Category\Providers;

use GGPHP\EvaluateTeacher\Category\Contracts\RatingLevelRepository;
use GGPHP\EvaluateTeacher\Category\Eloquent\RatingLevelRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class CategoryServiceProvider extends ServiceProvider
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
        $this->app->bind(RatingLevelRepository::class, RatingLevelRepositoryEloquent::class);
    }
}
