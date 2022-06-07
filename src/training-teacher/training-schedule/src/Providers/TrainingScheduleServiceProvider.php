<?php

namespace GGPHP\TrainingTeacher\TrainingSchedule\Providers;

use GGPHP\TrainingTeacher\TrainingSchedule\Repositories\Contracts\TrainingScheduleRepository;
use GGPHP\TrainingTeacher\TrainingSchedule\Repositories\Eloquent\TrainingScheduleRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class TrainingScheduleServiceProvider extends ServiceProvider
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
        $this->app->bind(TrainingScheduleRepository::class, TrainingScheduleRepositoryEloquent::class);
    }
}
