<?php

namespace GGPHP\WordExporter;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;
use GGPHP\WordExporter\Services\WordExporterServices;
use GGPHP\WordExporter\Services\Requests\WordExporterRequest;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\WordExporter\Http\Controllers';

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
            \Route::post('exporter/template-word', function (WordExporterRequest $request, WordExporterServices $excelExporterServices) {
                return $excelExporterServices->uploadTemplate($request);
            });
        });
    }

    public function forKiosk()
    {
        //
    }
}
