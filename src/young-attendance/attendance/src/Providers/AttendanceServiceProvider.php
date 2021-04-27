<?php

namespace GGPHP\Attendance\Providers;

use GGPHP\Attendance\Repositories\Contracts\AttendanceRepository;
use GGPHP\Attendance\Repositories\Eloquents\AttendanceRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class AttendanceServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadTranslationsFrom(__DIR__ . '/../../resources/lang', 'lang-program');
        if ($this->app->runningInConsole()) {
            $this->loadMigrationsFrom(__DIR__ . '/../../databases/migrations');
        }
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(AttendanceRepository::class, AttendanceRepositoryEloquent::class);
    }
}
