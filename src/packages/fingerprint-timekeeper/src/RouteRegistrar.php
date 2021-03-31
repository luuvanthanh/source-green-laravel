<?php

namespace GGPHP\FingerprintTimekeeper;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\FingerprintTimekeeper\Http\Controllers';

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
            //fingerprint timekeepers
            \Route::get('fingerprint-timekeepers', [
                'comment' => 'Danh sách máy chấm công',
                'uses' => 'FingerprintTimekeeperController@index',
                'as' => 'fingerprint-timekeepers.index',
                'group' => 'Máy chấm công',
            ]);

            \Route::post('fingerprint-timekeepers', [
                'comment' => 'Tạo mới máy chấm công',
                'uses' => 'FingerprintTimekeeperController@store',
                'as' => 'fingerprint-timekeepers.store',
                'group' => 'Máy chấm công',
            ]);

            \Route::put('fingerprint-timekeepers/{id}', [
                'comment' => 'Chỉnh sửa máy chấm công',
                'uses' => 'FingerprintTimekeeperController@update',
                'as' => 'fingerprint-timekeepers.update',
                'group' => 'Máy chấm công',
            ]);

            \Route::get('fingerprint-timekeepers/{id}', [
                'comment' => 'Thông tin máy chấm công',
                'uses' => 'FingerprintTimekeeperController@show',
                'as' => 'fingerprint-timekeepers.show',
                'group' => 'Máy chấm công',
            ]);

            \Route::delete('fingerprint-timekeepers/{id}', [
                'comment' => 'Xóa máy chấm công',
                'uses' => 'FingerprintTimekeeperController@destroy',
                'as' => 'fingerprint-timekeepers.destroy',
                'group' => 'Máy chấm công',
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
        \Route::group(['prefix' => 'kiosk'], function () {
            //fingerprint timekeepers
            \Route::get('fingerprint-timekeepers', [
                'comment' => 'Danh sách máy chấm công',
                'uses' => 'FingerprintTimekeeperController@index',
            ]);
        });
    }
}
