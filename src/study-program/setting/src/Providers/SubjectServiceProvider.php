<?php

namespace GGPHP\StudyProgram\Setting\Providers;

use GGPHP\StudyProgram\Setting\Repositories\Contracts\EvaluationCriteriaRepository;
use GGPHP\StudyProgram\Setting\Repositories\Contracts\SubjectRepository;
use GGPHP\StudyProgram\Setting\Repositories\Eloquent\EvaluationCriteriaRepositoryEloquent;
use GGPHP\StudyProgram\Setting\Repositories\Eloquent\SubjectRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class SubjectServiceProvider extends ServiceProvider
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
        $this->app->bind(SubjectRepository::class, SubjectRepositoryEloquent::class);
        $this->app->bind(EvaluationCriteriaRepository::class, EvaluationCriteriaRepositoryEloquent::class);
    }
}
