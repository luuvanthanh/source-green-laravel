<?php

namespace GGPHP\TeacherTimekeeping\Providers;

use GGPHP\TeacherTimekeeping\Repositories\Contracts\TeacherTimekeepingRepository;
use GGPHP\TeacherTimekeeping\Repositories\Eloquent\TeacherTimekeepingRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class TeacherTimekeepingServiceProvider extends ServiceProvider
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
        $this->app->bind(TeacherTimekeepingRepository::class, TeacherTimekeepingRepositoryEloquent::class);
    }
}
