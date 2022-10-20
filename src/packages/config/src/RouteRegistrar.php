<?php

namespace GGPHP\Config;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Config\Http\Controllers';

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
            \Route::group(['middleware' => []], function () {
                //configs
                \Route::get('configs', [
                    'comment' => 'Danh sách cấu hình',
                    'uses' => 'ConfigController@index',
                    'as' => 'configs.index',
                    'group' => 'Cấu hình',
                ]);

                \Route::post('configs', [
                    'comment' => 'Tạo mới cấu hình',
                    'uses' => 'ConfigController@store',
                    'as' => 'configs.store',
                    'group' => 'Cấu hình',
                ]);

                \Route::put('configs/{id}', [
                    'comment' => 'Chỉnh sửa cấu hình',
                    'uses' => 'ConfigController@update',
                    'as' => 'configs.update',
                    'group' => 'Cấu hình',
                ]);

                \Route::get('configs/{id}', [
                    'comment' => 'Thông tin cấu hình',
                    'uses' => 'ConfigController@show',
                    'as' => 'configs.show',
                    'group' => 'Cấu hình',
                ]);

                \Route::delete('configs/{id}', [
                    'comment' => 'Xóa cấu hình',
                    'uses' => 'ConfigController@destroy',
                    'as' => 'configs.destroy',
                    'group' => 'Cấu hình',
                ]);
            });

            \Route::resource('config-notifications', 'ConfigNotificationController');
        });
    }
}
