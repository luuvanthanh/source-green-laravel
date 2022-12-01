<?php

namespace GGPHP\StudyProgram\Setting\Providers;

use GGPHP\StudyProgram\Setting\Repositories\Contracts\EvaluationCriteriaRepository;
<<<<<<< HEAD
use GGPHP\StudyProgram\Setting\Repositories\Contracts\SubjectRepository;
use GGPHP\StudyProgram\Setting\Repositories\Eloquent\EvaluationCriteriaRepositoryEloquent;
=======
use GGPHP\StudyProgram\Setting\Repositories\Contracts\SampleCommentRepository;
use GGPHP\StudyProgram\Setting\Repositories\Contracts\SubjectRepository;
use GGPHP\StudyProgram\Setting\Repositories\Eloquent\EvaluationCriteriaRepositoryEloquent;
use GGPHP\StudyProgram\Setting\Repositories\Eloquent\SampleCommentRepositoryEloquent;
>>>>>>> f26c4c9ce7dd9a40420dc2f9b4ac187684f9ea2b
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
<<<<<<< HEAD
=======
        $this->app->bind(SampleCommentRepository::class, SampleCommentRepositoryEloquent::class);
>>>>>>> f26c4c9ce7dd9a40420dc2f9b4ac187684f9ea2b
    }
}
