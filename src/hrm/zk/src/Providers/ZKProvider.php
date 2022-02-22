<?php

namespace ZK\Providers;

use Illuminate\Support\ServiceProvider;

class ZKProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     */
    public function boot()
    {
        /*
         * Optional methods to load your package assets
         */
        $this->loadMigrationsFrom(__DIR__.'/../../database/migrations');

        // $this->loadRoutesFrom(__DIR__.'/routes.php');
        $this->publishes([
            __DIR__.'/../../config/config.php' => config_path('zk.php')
        ]);
        $this->mergeConfigFrom(__DIR__.'/../../config/config.php', 'zk');

        // Registering package commands.
        // $this->commands([]);
    }

    /**
     * Register the application services.
     */
    public function register()
    {
        // Automatically apply the package configuration
        // Register the main class to use with the facade
    }
}
