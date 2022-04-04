<?php

namespace GGPHP\InOutHistories;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\InOutHistories\Http\Controllers';

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
            //in-out-histories
            \Route::get('in-out-histories', [
                'comment' => 'Danh sách lịch sử vào ra trẻ',
                'uses' => 'InOutHistoriesController@index',
            ]);

            \Route::post('in-out-histories', [
                'comment' => 'Tạo mới lịch sử vào ra trẻ',
                'uses' => 'InOutHistoriesController@store',
            ]);

            \Route::get('in-out-histories/{id}', [
                'comment' => 'Thông tin lịch sử vào ra trẻ',
                'uses' => 'InOutHistoriesController@show',
            ]);
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
            \Route::post('in-out-histories', [
                'comment' => 'Tạo mới lịch sử vào ra trẻ',
                'uses' => 'InOutHistoriesController@store',
            ]);
        });
    }
}
