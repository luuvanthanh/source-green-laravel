<?php

namespace GGPHP\MaternityLeave;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\MaternityLeave\Http\Controllers';

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
            //maternity-leaves
            \Route::get('maternity-leaves', [
                'comment' => 'Danh sách công bù giờ',
                'uses' => 'MaternityLeaveController@index',
                'as' => 'maternity-leaves.index',
                'group' => 'Công bù giờ',
            ]);

            \Route::post('maternity-leaves', [
                'comment' => 'Tạo mới công bù giờ',
                'uses' => 'MaternityLeaveController@store',
                'as' => 'maternity-leaves.store',
                'group' => 'Công bù giờ',
            ]);

            \Route::put('maternity-leaves/{id}', [
                'comment' => 'Chỉnh sửa công bù giờ',
                'uses' => 'MaternityLeaveController@update',
                'as' => 'maternity-leaves.update',
                'group' => 'Công bù giờ',
            ]);

            \Route::get('maternity-leaves/{id}', [
                'comment' => 'Thông tin công bù giờ',
                'uses' => 'MaternityLeaveController@show',
                'as' => 'maternity-leaves.show',
                'group' => 'Công bù giờ',
            ]);

            \Route::delete('maternity-leaves/{id}', [
                'comment' => 'Xóa công bù giờ',
                'uses' => 'MaternityLeaveController@destroy',
                'as' => 'maternity-leaves.destroy',
                'group' => 'Công bù giờ',
            ]);

        });
    }
}
