<?php

namespace GGPHP\TeacherAssignment\Providers;

use GGPHP\TeacherAssignment\Repositories\Contracts\TeacherAssignmentRepository;
use GGPHP\TeacherAssignment\Repositories\Eloquent\TeacherAssignmentRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class TeacherAssignmentServiceProvider extends ServiceProvider
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
        $this->app->bind(TeacherAssignmentRepository::class, TeacherAssignmentRepositoryEloquent::class);
    }
}
