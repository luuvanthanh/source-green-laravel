<?php

namespace GGPHP\Report;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Report\Http\Controllers';

    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forBread();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forBread()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::get('report-general', 'ReportController@generalReport');
            \Route::get('report-number-event-behavior', 'ReportController@numberEventReportBehavior');
            \Route::get('report-number-event-object', 'ReportController@numberEventReportObject');
            \Route::get('report-frequency-of-appearance', 'ReportController@frequencyOfAppearanceReport');
        });
    }
}
