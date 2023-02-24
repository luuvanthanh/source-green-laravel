<?php

namespace GGPHP\StudyProgram\ScriptReview\Providers;

use GGPHP\StudyProgram\ScriptReview\Repositories\Contracts\ScriptReviewRepository;
use GGPHP\StudyProgram\ScriptReview\Repositories\Eloquent\ScriptReviewRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class ScriptReviewServiceProvider extends ServiceProvider
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
        $this->app->bind(ScriptReviewRepository::class, ScriptReviewRepositoryEloquent::class);
    }
}
