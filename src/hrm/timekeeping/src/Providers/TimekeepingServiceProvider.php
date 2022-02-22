<?php

namespace GGPHP\Timekeeping\Providers;

use GGPHP\Timekeeping\Models\Timekeeping;
use GGPHP\Timekeeping\Repositories\Contracts\TimekeepingRepository;
use GGPHP\Timekeeping\Repositories\Eloquent\TimekeepingRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class TimekeepingServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../../config/config.php',
            'constants-timekeeping'
        );
        $this->loadTranslationsFrom(__DIR__ . '/../../resources/lang', 'lang-timekeeping');
        if ($this->app->runningInConsole()) {
            $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations');
        }
        // Timekeeping::observe(TimekeepingObserver::class);
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(TimekeepingRepository::class, TimekeepingRepositoryEloquent::class);
    }
}
