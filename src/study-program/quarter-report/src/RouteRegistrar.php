<?php

namespace GGPHP\StudyProgram\QuarterReport;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\StudyProgram\QuarterReport\Http\Controllers';

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
            \Route::resource('quarter-reports', 'QuarterReportController');
            \Route::post('update-status-quarter-reports', 'QuarterReportController@updateStatusQuarterReport');
            \Route::post('notification-quarter-reports', 'QuarterReportController@notificationQuarterReport');
            \Route::post('update-all-status-quarter-reports', 'QuarterReportController@updateAllStatusQuarterReport');
            \Route::post('notification-all-status-quarter-reports', 'QuarterReportController@notificationAllStatusQuarterReport');
            \Route::delete('delete-quarter-report/{id}', 'QuarterReportController@deleteQuarterReport');
            \Route::get('count-student-quarter-report-by-status','QuarterReportController@countStudentQuarterReportByStatus');
        });
    }
}
