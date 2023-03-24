<?php

namespace GGPHP\ExpectedTime;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\ExpectedTime\Http\Controllers';

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
            \Route::resource('expected-times', 'ExpectedTimeController');

            // dowload template
            \Route::get('template-excel-teacher-profile', 'ExpectedTimeController@templateExcelTeacherProfile');
            \Route::post('import-excel-teacher-profile', 'ExpectedTimeController@importExcelTeacherProfile');
        });
    }
}
