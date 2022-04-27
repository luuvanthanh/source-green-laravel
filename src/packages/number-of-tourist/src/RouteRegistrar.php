<?php

namespace GGPHP\NumberOfTourist;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\NumberOfTourist\Http\Controllers';

    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forBread();
        $this->forAi();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forBread()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::get('report-number-of-tourists', [
                'comment' => 'Số lượng khách du lịch',
                'uses' => 'NumberOfTouristController@report',
                'as' => 'VIEW_STATISTICSTOURIST',
                'group' => 'Báo cáo thống kê',
            ])->middleware('permission_for_role:VIEW_STATISTICSTOURIST');

            \Route::get('export-excel-report-number-of-tourists', 'NumberOfTouristController@exportExcel');
        });
    }


    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forAi()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::resource('number-of-tourists', 'NumberOfTouristController')->only('store');
        });
    }
}
