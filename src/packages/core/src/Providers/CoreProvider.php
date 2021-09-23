<?php

namespace GGPHP\Core\Providers;

use Illuminate\Support\ServiceProvider;

class CoreProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     */
    public function boot()
    {
        /*
         * Optional methods to load your package assets
         */
        // $this->loadTranslationsFrom(__DIR__.'/../resources/lang', 'employees');
        // $this->loadViewsFrom(__DIR__.'/../resources/views', 'employees');
        $this->loadMigrationsFrom(__DIR__ . '/../database/migrations');
        // $this->loadRoutesFrom(__DIR__.'/routes.php');
        // $this->publishes([
        //     __DIR__ . '/../../config/config.php' => config_path('core.php'),
        // ]);
        $this->mergeConfigFrom(__DIR__ . '/../../config/constants.php', 'constants');

        $this->loadTranslationsFrom(__DIR__ . '/../../resources/lang', 'lang');

        // Publishing the views.
        /*$this->publishes([
        __DIR__.'/../resources/views' => resource_path('views/vendor/employees'),
        ], 'views');*/

        // Publishing assets.
        /*$this->publishes([
        __DIR__.'/../resources/assets' => public_path('vendor/employees'),
        ], 'assets');*/

        // Publishing the translation files.
        /*$this->publishes([
        __DIR__.'/../resources/lang' => resource_path('lang/vendor/employees'),
        ], 'lang');*/

        // Registering package commands.
        // $this->commands([]);
    }

    /**
     * Register the application services.
     */
    public function register()
    {
        // Automatically apply the package configuration
    }
}
