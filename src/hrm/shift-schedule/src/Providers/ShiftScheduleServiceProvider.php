<?php

namespace GGPHP\ShiftSchedule\Providers;

use GGPHP\ShiftSchedule\Repositories\Contracts\DivisionShiftRepository;
use GGPHP\ShiftSchedule\Repositories\Contracts\ScheduleRepository;
use GGPHP\ShiftSchedule\Repositories\Contracts\ShiftRepository;
use GGPHP\ShiftSchedule\Repositories\Eloquent\DivisionShiftRepositoryEloquent;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ShiftRepositoryEloquent;
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
        $this->app->bind(DivisionShiftRepository::class, DivisionShiftRepositoryEloquent::class);
        $this->app->bind(ScheduleRepository::class, ScheduleRepositoryEloquent::class);
    }
}
