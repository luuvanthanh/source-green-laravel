<?php

namespace GGPHP\YoungAttendance\ShiftSchedule\Providers;

use GGPHP\YoungAttendance\ShiftSchedule\Repositories\Contracts\ScheduleRepository;
use GGPHP\YoungAttendance\ShiftSchedule\Repositories\Contracts\ShiftRepository;
use GGPHP\YoungAttendance\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\YoungAttendance\ShiftSchedule\Repositories\Eloquent\ShiftRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class ShiftScheduleServiceProvider extends ServiceProvider
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
        $this->app->bind(ShiftRepository::class, ShiftRepositoryEloquent::class);
        $this->app->bind(ScheduleRepository::class, ScheduleRepositoryEloquent::class);
    }
}
