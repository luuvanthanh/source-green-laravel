<?php

namespace GGPHP\Camera\Providers;

use GGPHP\Camera\Repositories\Contracts\CameraCollectionRepository;
use GGPHP\Camera\Repositories\Contracts\CameraRepository;
use GGPHP\Camera\Repositories\Eloquent\CameraCollectionRepositoryEloquent;
use GGPHP\Camera\Repositories\Eloquent\CameraRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class CameraServiceProvider extends ServiceProvider
{

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../config/config.php',
            'constants'
        );

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
        $this->app->bind(CameraRepository::class, CameraRepositoryEloquent::class);
        $this->app->bind(CameraCollectionRepository::class, CameraCollectionRepositoryEloquent::class);
    }
}
