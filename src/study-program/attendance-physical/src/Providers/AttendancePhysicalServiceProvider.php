<?php

namespace GGPHP\StudyProgram\AttendancePhysical\Providers;

use GGPHP\StudyProgram\AttendancePhysical\Repositories\Contracts\AttendancePhysicalRepository;
use GGPHP\StudyProgram\AttendancePhysical\Repositories\Eloquent\AttendancePhysicalRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class AttendancePhysicalServiceProvider extends ServiceProvider
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
        $this->app->bind(AttendancePhysicalRepository::class, AttendancePhysicalRepositoryEloquent::class);
    }
}
