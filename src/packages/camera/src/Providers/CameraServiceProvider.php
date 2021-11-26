<?php

namespace GGPHP\Camera\Providers;

use GGPHP\Camera\Models\Camera;
use GGPHP\Camera\Repositories\Contracts\CameraCollectionRepository;
use GGPHP\Camera\Repositories\Contracts\CameraGeneralPropertiesRepository;
use GGPHP\Camera\Repositories\Contracts\CameraNetworkPropertiesRepository;
use GGPHP\Camera\Repositories\Contracts\CameraPtzPropertiesRepository;
use GGPHP\Camera\Repositories\Contracts\CameraRepository;
use GGPHP\Camera\Repositories\Contracts\CameraVideoPropertiesRepository;
use GGPHP\Camera\Repositories\Eloquent\CameraCollectionRepositoryEloquent;
use GGPHP\Camera\Repositories\Eloquent\CameraGeneralPropertiesRepositoryEloquent;
use GGPHP\Camera\Repositories\Eloquent\CameraNetworkPropertiesRepositoryEloquent;
use GGPHP\Camera\Repositories\Eloquent\CameraPtzPropertiesRepositoryEloquent;
use GGPHP\Camera\Repositories\Eloquent\CameraRepositoryEloquent;
use GGPHP\Camera\Repositories\Eloquent\CameraVideoPropertiesRepositoryEloquent;
use GGPHP\Collection\Repositories\Eloquent\CollectionRepositoryEloquent;
use GGPHP\Users\Repositories\Eloquent\UserCollectionRepositoryEloquent;
use Illuminate\Support\ServiceProvider;
use GGPHP\Camera\Commands\UpdateStatusCamera;

class CameraServiceProvider extends ServiceProvider
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
            $this->commands([UpdateStatusCamera::class]);
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
        $this->app->bind(CameraGeneralPropertiesRepository::class, CameraGeneralPropertiesRepositoryEloquent::class);
        $this->app->bind(CameraNetworkPropertiesRepository::class, CameraNetworkPropertiesRepositoryEloquent::class);
        $this->app->bind(CameraVideoPropertiesRepository::class, CameraVideoPropertiesRepositoryEloquent::class);
        $this->app->bind(CameraPtzPropertiesRepository::class, CameraPtzPropertiesRepositoryEloquent::class);
    }
}
