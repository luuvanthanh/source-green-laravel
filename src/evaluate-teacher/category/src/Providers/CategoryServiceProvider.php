<?php

namespace GGPHP\EvaluateTeacher\Category\Providers;

use GGPHP\EvaluateTeacher\Category\Repositories\Contracts\TypeTeacherRepository;
use GGPHP\EvaluateTeacher\Category\Repositories\Eloquent\TypeTeacherRepositoryEloquent;
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
        $this->app->bind(TypeTeacherRepository::class, TypeTeacherRepositoryEloquent::class);
    }
}
