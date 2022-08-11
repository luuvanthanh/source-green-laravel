<?php

namespace GGPHP\ActivityLog\Providers;

use GGPHP\ActivityLog\Repositories\Contracts\ActivityLogRepository;
use GGPHP\ActivityLog\Repositories\Eloquent\ActivityLogRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class ActivityLogServiceProvider extends ServiceProvider
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
            'constants-activity'
        );
        $this->loadTranslationsFrom(__DIR__ . '/../../resources/lang', 'lang-activity');
        $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations');
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(ActivityLogRepository::class, ActivityLogRepositoryEloquent::class);
    }
}
