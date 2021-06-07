<?php

namespace GGPHP\ExcelExporter\Providers;

use Illuminate\Support\ServiceProvider;

class ExcelExporterServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->mergeConfigFrom(__DIR__ . '/../../config/excel-exporter.php', 'excel-exporter');

        $this->loadTranslationsFrom(__DIR__ . '/../../resources/lang', 'excel-exporter');
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
