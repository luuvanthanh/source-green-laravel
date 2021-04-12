<?php

namespace GGPHP\PositionLevel;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\PositionLevel\Http\Controllers';

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
            //position-level
            \Route::get('position-levels', [
                'comment' => 'Danh sách cấp bậc chức vụ',
                'uses' => 'PositionLevelController@index',
                'as' => 'position-levels.index',
                'group' => 'Cấp bậc chức vụ',
            ]);

            \Route::post('position-levels', [
                'comment' => 'Tạo/Sửa cấp bậc chức vụ',
                'uses' => 'PositionLevelController@store',
                'as' => 'position-levels.store',
                'group' => 'Cấp bậc chức vụ',
            ]);

            \Route::get('position-levels/{id}', [
                'comment' => 'Chi tiết cấp bậc chức vụ',
                'uses' => 'PositionLevelController@show',
                'as' => 'position-levels.show',
                'group' => 'Cấp bậc chức vụ',
            ]);

            \Route::put('position-levels/{id}', [
                'comment' => 'Chỉnh sửa cấp bậc chức vụ',
                'uses' => 'PositionLevelController@update',
                'as' => 'position-levels.update',
                'group' => 'Cấp bậc chức vụ',
            ]);

            \Route::delete('position-levels/{id}', [
                'comment' => 'Xóa cấp bậc chức vụ',
                'uses' => 'PositionLevelController@destroy',
                'as' => 'position-levels.destroy',
                'group' => 'Cấp bậc chức vụ',
            ]);

            \Route::get('position-level-user/{id}', [
                'uses' => 'PositionLevelController@getForUser',
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
        $this->router->group(['middleware' => []], function ($router) {
            \Route::group(['prefix' => 'kiosk'], function () {
                //divisions
                \Route::get('divisions', [
                    'uses' => 'PositionLevelController@index',
                    'as' => 'kiosk.divisions.index',
                ]);
            });
        });
    }
}
