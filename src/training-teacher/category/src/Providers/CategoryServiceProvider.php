<?php

namespace GGPHP\TrainingTeacher\Category\Providers;

use GGPHP\TrainingTeacher\Category\Repositories\Contracts\TrainingFormRepository;
use GGPHP\TrainingTeacher\Category\Repositories\Contracts\TrainingModuleRepository;
use GGPHP\TrainingTeacher\Category\Repositories\Contracts\TrainingSkillRepository;
use GGPHP\TrainingTeacher\Category\Repositories\Eloquent\TrainingFormRepositoryEloquent;
use GGPHP\TrainingTeacher\Category\Repositories\Eloquent\TrainingModuleRepositoryEloquent;
use GGPHP\TrainingTeacher\Category\Repositories\Eloquent\TrainingSkillRepositoryEloquent;
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
        $this->app->bind(TrainingFormRepository::class, TrainingFormRepositoryEloquent::class);
        $this->app->bind(TrainingSkillRepository::class, TrainingSkillRepositoryEloquent::class);
        $this->app->bind(TrainingModuleRepository::class, TrainingModuleRepositoryEloquent::class);
    }
}
