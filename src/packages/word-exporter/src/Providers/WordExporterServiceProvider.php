<?php

namespace GGPHP\WordExporter\Providers;

use Illuminate\Support\ServiceProvider;

class WordExporterServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->mergeConfigFrom(__DIR__ . '/../../config/word-exporter.php', 'word-exporter');
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
