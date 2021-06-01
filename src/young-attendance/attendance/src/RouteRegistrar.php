<?php

namespace GGPHP\Attendance;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Attendance\Http\Controllers';

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
            \Route::resource('attendances', 'AttendanceController');
            \Route::resource('attendance-logs', 'AttendanceLogController');
            \Route::resource('attendances-reasons', 'AttendanceReasonController');

            \Route::get('attendances-summary', 'AttendanceController@attendancesSummary');
        });
    }
}
