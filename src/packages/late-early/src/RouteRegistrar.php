<?php

namespace GGPHP\LateEarly;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\LateEarly\Http\Controllers';

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
            //late-early-config
            \Route::get('late-early-config', [
                'comment' => 'Danh sách cấu hình đi trễ về sớm',
                'uses' => 'LateEarlyConfigController@index',
                'as' => 'late-early-config.index',
                'group' => 'Cấu hình đi trễ về sớm',
            ]);

            \Route::post('late-early-config', [
                'comment' => 'Tạo mới cấu hình đi trễ về sớm',
                'uses' => 'LateEarlyConfigController@store',
                'as' => 'late-early-config.store',
                'group' => 'Cấu hình đi trễ về sớm',
            ]);

            \Route::put('late-early-config/{id}', [
                'comment' => 'Chỉnh sửa cấu hình đi trễ về sớm',
                'uses' => 'LateEarlyConfigController@update',
                'as' => 'late-early-config.update',
                'group' => 'Cấu hình đi trễ về sớm',
            ]);

            \Route::get('late-early-config/{id}', [
                'comment' => 'Thông tin cấu hình đi trễ về sớm',
                'uses' => 'LateEarlyConfigController@show',
                'as' => 'late-early-config.show',
                'group' => 'Cấu hình đi trễ về sớm',
            ]);

            \Route::delete('late-early-config/{id}', [
                'comment' => 'Xóa cấu hình đi trễ về sớm',
                'uses' => 'LateEarlyConfigController@destroy',
                'as' => 'late-early-config.destroy',
                'group' => 'Cấu hình đi trễ về sớm',
            ]);

            //late-early
            \Route::get('late-early', [
                'comment' => 'Danh sách đi trễ về sớm',
                'uses' => 'LateEarlyController@index',
                'as' => 'late-early.index',
                'group' => 'Đi trễ về sớm',
            ]);

            \Route::get('late-early/{id}', [
                'comment' => 'Thông tin đi trễ về sớm',
                'uses' => 'LateEarlyController@show',
                'as' => 'late-early.show',
                'group' => 'Đi trễ về sớm',
            ]);

            \Route::get('user/late-early', [
                'comment' => 'Tổng hợp đi trễ về sớm',
                'uses' => 'LateEarlyController@lateEarlyByUser',
                'as' => 'late-early.summary',
                'group' => 'Đi trễ về sớm',
            ]);

            \Route::get('timekeeping-invalid', [
                'comment' => 'Tổng hợp công không xác định',
                'uses' => 'LateEarlyController@invalidTimekeeping',
                'as' => 'timekeeping.invalid.summary',
                'group' => 'Công',
            ]);

        });
    }

    public function forCronJob()
    {
        \Route::get('late-early-report', [
            'uses' => 'LateEarlyController@getLateEarlyReport',
            'as' => 'late-early.report',
        ]);
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forKiosk()
    {
        $this->router->group(['prefix' => 'kiosk'], function ($router) {
            \Route::get('timekeeping-invalid', [
                'uses' => 'LateEarlyController@invalidTimekeeping',
                'as' => 'timekeeping.invalid.summary',
            ]);
        });
    }
}
