<?php

namespace GGPHP\InterviewManager\Providers;

use GGPHP\InterviewManager\Repositories\Contracts\EvaluationCriteriaRepository;
use GGPHP\InterviewManager\Repositories\Contracts\PointEvaluationRepository;
use GGPHP\InterviewManager\Repositories\Eloquents\EvaluationCriteriaRepositoryEloquent;
use GGPHP\InterviewManager\Repositories\Eloquents\PointEvaluationRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class InterviewManagerServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadTranslationsFrom(__DIR__ . '/../../resources/lang', 'lang-program');
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
        $this->app->bind(EvaluationCriteriaRepository::class, EvaluationCriteriaRepositoryEloquent::class);
        $this->app->bind(PointEvaluationRepository::class, PointEvaluationRepositoryEloquent::class);
    }
}
