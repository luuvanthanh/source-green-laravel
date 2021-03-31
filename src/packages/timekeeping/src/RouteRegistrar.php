<?php

namespace GGPHP\Timekeeping;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Timekeeping\Http\Controllers';

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
            //timekeeping
            \Route::get('timekeeping', [
                'comment' => 'Danh sách chấm công',
                'uses' => 'TimekeepingController@index',
                'as' => 'timekeeping.index',
                'group' => 'Công',
            ]);

            \Route::get('timekeeping-report', [
                'comment' => 'Tổng hợp công',
                'uses' => 'ReportTimekeepingController@getTimekeepingReport',
                'as' => 'timekeeping.summary',
                'group' => 'Công',
            ]);
        });
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forKiosk()
    {
        $this->router->group(['prefix' => 'kiosk'], function ($router) {
            //timekeeping
            \Route::get('timekeeping', [
                'uses' => 'TimekeepingController@index',
                'as' => 'timekeeping.index',
            ]);
        });
    }
}
