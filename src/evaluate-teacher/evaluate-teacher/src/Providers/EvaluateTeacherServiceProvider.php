<?php

namespace GGPHP\EvaluateTeacher\EvaluateTeacher\Providers;

use GGPHP\EvaluateTeacher\EvaluateTeacher\Repositories\Contracts\EvaluateTeacherRepository;
use GGPHP\EvaluateTeacher\EvaluateTeacher\Repositories\Eloquent\EvaluateTeacherRepositoryEloquent;
use GGPHP\EvaluateTeacher\EvaluateTeacher\Contracts\RatingLevelRepository;
use GGPHP\EvaluateTeacher\EvaluateTeacher\Contracts\SkillGroupRepository;
use GGPHP\EvaluateTeacher\EvaluateTeacher\Eloquent\RatingLevelRepositoryEloquent;
use GGPHP\EvaluateTeacher\EvaluateTeacher\Eloquent\SkillGroupRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class EvaluateTeacherServiceProvider extends ServiceProvider
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
        $this->app->bind(EvaluateTeacherRepository::class, EvaluateTeacherRepositoryEloquent::class);
    }
}
