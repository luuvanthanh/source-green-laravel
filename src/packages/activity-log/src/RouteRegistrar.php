<?php

namespace GGPHP\ActivityLog;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\ActivityLog\Http\Controllers';

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

            \Route::get('activity-logs', [
                'comment' => 'Danh sách lịch sử hệ thống',
                'uses' => 'ActivityLogController@index',
                'as' => 'activity-logs.index',
                'group' => 'Lịch sử hệ thống',
            ]);

            \Route::get('activity-logs/{id}', [
                'comment' => 'Thông tin lịch sử hệ thống',
                'uses' => 'ActivityLogController@show',
                'as' => 'activity-logs.show',
                'group' => 'Lịch sử hệ thống',
            ]);

            \Route::get('export-excel-activity-logs', 'ActivityLogController@exportExcel');
        });
    }
}
