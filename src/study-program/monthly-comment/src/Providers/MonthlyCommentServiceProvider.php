<?php

namespace GGPHP\StudyProgram\MonthlyComment\Providers;

use GGPHP\StudyProgram\MonthlyComment\Repositories\Contracts\MonthlyCommentRepository;
use GGPHP\StudyProgram\MonthlyComment\Repositories\Eloquent\MonthlyCommentRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class MonthlyCommentServiceProvider extends ServiceProvider
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
        $this->app->bind(MonthlyCommentRepository::class, MonthlyCommentRepositoryEloquent::class);
    }
}
