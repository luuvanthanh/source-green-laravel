<?php

namespace GGPHP\CameraServer\Providers;

use GGPHP\CameraServer\Repositories\Contracts\CameraServerRepository;
use GGPHP\CameraServer\Repositories\Eloquent\CameraServerRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class CameraServerServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../config/config.php', 'constants'
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
        $this->app->bind(CameraServerRepository::class, CameraServerRepositoryEloquent::class);
    }
}
