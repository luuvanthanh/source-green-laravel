<?php

namespace GGPHP\ExcelExporter;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\ExcelExporter\Services\Requests\WordExporterRequest;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\ExcelExporter\Http\Controllers';

    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forBread();
        $this->forKiosk();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forBread()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::post('exporter/template-word', function (WordExporterRequest $request, ExcelExporterServices $excelExporterServices) {
                return $excelExporterServices->uploadTemplate($request);
            });
        });
    }

    public function forKiosk()
    {
        //
    }
}
