<?php

namespace GGPHP\TrainingTeacher\TrainingModuleBoard\Providers;

use GGPHP\TrainingTeacher\TrainingModuleBoard\Repositories\Contracts\TeacherTrainingBoardRepository;
use GGPHP\TrainingTeacher\TrainingModuleBoard\Repositories\Eloquent\TeacherTrainingBoardRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class TrainingModuleBoardServiceProvider extends ServiceProvider
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
        $this->app->bind(TeacherTrainingBoardRepository::class, TeacherTrainingBoardRepositoryEloquent::class);
    }
}
