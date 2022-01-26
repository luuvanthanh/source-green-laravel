<?php

namespace GGPHP\ChildDevelop\TestSemester\Providers;

use GGPHP\ChildDevelop\TestSemester\Repositories\Contracts\TestSemesterRepository;
use GGPHP\ChildDevelop\TestSemester\Repositories\Eloquent\TestSemesterRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class TestSemesterServiceProvider extends ServiceProvider
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
        $this->app->bind(TestSemesterRepository::class, TestSemesterRepositoryEloquent::class);
    }
}
