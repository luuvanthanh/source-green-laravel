<?php

namespace GGPHP\LateEarly\Providers;

use GGPHP\LateEarly\Models\LateEarly;
use GGPHP\LateEarly\Repositories\Eloquent\LateEarlyConfigRepositoryEloquent;
use GGPHP\LateEarly\Repositories\Eloquent\LateEarlyRepositoryEloquent;
use GGPHP\LateEarly\Repositories\Eloquent\WorkDeclarationRepositoryEloquent;
use GGPHP\LateEarly\Repositories\LateEarly\LateEarlyConfigRepository;
use GGPHP\LateEarly\Repositories\LateEarly\LateEarlyRepository;
use GGPHP\LateEarly\Repositories\LateEarly\WorkDeclarationRepository;
use Illuminate\Support\ServiceProvider;

class LateEarlyServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../../config/config.php', 'constants-lateEarly'
        );
        $this->loadTranslationsFrom(__DIR__ . '/../../resources/lang', 'lang-lateEarly');
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
        $this->app->bind(LateEarlyRepository::class, LateEarlyRepositoryEloquent::class);
        $this->app->bind(LateEarlyConfigRepository::class, LateEarlyConfigRepositoryEloquent::class);
        $this->app->bind(WorkDeclarationRepository::class, WorkDeclarationRepositoryEloquent::class);
    }
}
