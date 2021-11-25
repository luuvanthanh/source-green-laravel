<?php

namespace GGPHP\Collection\Providers;

use GGPHP\Collection\Repositories\Contracts\CollectionRepository;
use GGPHP\Collection\Repositories\Eloquent\CollectionRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class CollectionServiceProvider extends ServiceProvider
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
        $this->app->bind(CollectionRepository::class, CollectionRepositoryEloquent::class);
    }
}
