<?php

namespace GGPHP\YoungAttendance\Absent\Providers;

use GGPHP\YoungAttendance\Absent\Repositories\Absent\AbsentReasonRepository;
use GGPHP\YoungAttendance\Absent\Repositories\Absent\AbsentRepository;
use GGPHP\YoungAttendance\Absent\Repositories\Absent\AbsentTypeRepository;
use GGPHP\YoungAttendance\Absent\Repositories\Absent\RevokeShiftRepository;
use GGPHP\YoungAttendance\Absent\Repositories\Eloquent\AbsentReasonRepositoryEloquent;
use GGPHP\YoungAttendance\Absent\Repositories\Eloquent\AbsentRepositoryEloquent;
use GGPHP\YoungAttendance\Absent\Repositories\Eloquent\AbsentTypeRepositoryEloquent;
use GGPHP\YoungAttendance\Absent\Repositories\Eloquent\RevokeShiftRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class AbsentServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../../config/config.php', 'constants-absent'
        );
        $this->loadTranslationsFrom(__DIR__ . '/../../resources/lang', 'lang-absent');
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
        $this->app->bind(AbsentRepository::class, AbsentRepositoryEloquent::class);
        $this->app->bind(AbsentTypeRepository::class, AbsentTypeRepositoryEloquent::class);
        $this->app->bind(AbsentReasonRepository::class, AbsentReasonRepositoryEloquent::class);
        $this->app->bind(RevokeShiftRepository::class, RevokeShiftRepositoryEloquent::class);
    }
}
