<?php

namespace GGPHP\VideoWall\Providers;

use GGPHP\VideoWall\Repositories\Contracts\VideoWallRepository;
use GGPHP\VideoWall\Repositories\Eloquent\VideoWallRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class VideoWallServiceProvider extends ServiceProvider
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
        $this->app->bind(VideoWallRepository::class, VideoWallRepositoryEloquent::class);
    }
}
