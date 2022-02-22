<?php

namespace GGPHP\Fingerprint\Providers;

use GGPHP\Fingerprint\Repositories\Contracts\FingerprintRepository;
use GGPHP\Fingerprint\Repositories\Eloquent\FingerprintRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class FingerprintProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     */
    public function boot()
    {
        /*
         * Optional methods to load your package assets
         */
        $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations');

        // $this->loadRoutesFrom(__DIR__.'/routes.php');
        $this->publishes([
            __DIR__ . '/../../config/config.php' => config_path('fingerprint.php'),
        ]);
        $this->mergeConfigFrom(__DIR__ . '/../../config/config.php', 'fingerprint');

        // Registering package commands.
        // $this->commands([]);
    }

    /**
     * Register the application services.
     */
    public function register()
    {
        // Automatically apply the package configuration
        // $this->app->register('GGPHP\Fingerprints\Providers\FingerprintProvider');
        // Register the main class to use with the facade
        $this->app->bind(FingerprintRepository::class, FingerprintRepositoryEloquent::class);
        // $this->app->singleton('employees', function () {
        // return new \Meisoft\Models\User;
        // });
    }
}
