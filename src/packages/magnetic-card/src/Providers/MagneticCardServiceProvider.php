<?php

namespace GGPHP\MagneticCard\Providers;

use GGPHP\MagneticCard\Repositories\Contracts\MagneticCardRepository;
use GGPHP\MagneticCard\Repositories\Eloquent\MagneticCardRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class MagneticCardServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
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
        $this->app->bind(MagneticCardRepository::class, MagneticCardRepositoryEloquent::class);
    }
}
