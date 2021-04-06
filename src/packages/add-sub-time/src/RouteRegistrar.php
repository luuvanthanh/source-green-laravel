<?php

namespace GGPHP\AddSubTime;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\AddSubTime\Http\Controllers';

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
            //add-sub times
            \Route::get('add-sub-times', [
                'comment' => 'Danh sách công thêm, công trừ',
                'uses' => 'AddSubTimeController@index',
                'as' => 'add-sub-times.index',
                'group' => 'Công thêm, công trừ',
            ]);

            \Route::post('add-sub-times', [
                'comment' => 'Tạo mới công thêm, công trừ',
                'uses' => 'AddSubTimeController@store',
                'as' => 'add-sub-times.store',
                'group' => 'Công thêm, công trừ',
            ]);

            \Route::get('add-sub-times/{id}', [
                'comment' => 'Thông tin công thêm, công trừ',
                'uses' => 'AddSubTimeController@show',
                'as' => 'add-sub-times.show',
                'group' => 'Công thêm, công trừ',
            ]);

            \Route::get('add-sub-time-general', [
                'comment' => 'Tổng hợp công thêm, công trừ',
                'uses' => 'AddSubTimeController@generalAddSubTime',
                'as' => 'add-sub-times.summary',
                'group' => 'Công thêm, công trừ',
            ]);
        });
    }
}
