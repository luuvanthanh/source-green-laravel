<?php

namespace GGPHP\WorkHour;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\WorkHour\Http\Controllers';

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
            //work-hours
            \Route::get('work-hours', [
                'comment' => 'Danh sách công bù giờ',
                'uses' => 'WorkHourController@index',
                'as' => 'work-hours.index',
                'group' => 'Công bù giờ',
            ]);

            \Route::post('work-hours', [
                'comment' => 'Tạo mới công bù giờ',
                'uses' => 'WorkHourController@store',
                'as' => 'work-hours.store',
                'group' => 'Công bù giờ',
            ]);

            \Route::put('work-hours/{id}', [
                'comment' => 'Chỉnh sửa công bù giờ',
                'uses' => 'WorkHourController@update',
                'as' => 'work-hours.update',
                'group' => 'Công bù giờ',
            ]);

            \Route::get('work-hours/{id}', [
                'comment' => 'Thông tin công bù giờ',
                'uses' => 'WorkHourController@show',
                'as' => 'work-hours.show',
                'group' => 'Công bù giờ',
            ]);

            \Route::delete('work-hours/{id}', [
                'comment' => 'Xóa công bù giờ',
                'uses' => 'WorkHourController@destroy',
                'as' => 'work-hours.destroy',
                'group' => 'Công bù giờ',
            ]);

            \Route::get('work-hours-summary', [
                'comment' => 'Tổng hợp công ngoài giờ',
                'uses' => 'WorkHourController@workHourSummary',
                'as' => 'timekeeping.invalid.summary',
                'group' => 'Công',
            ]);

            \Route::get('work-hours-summary-export', [
                'comment' => 'Tổng hợp công ngoài giờ',
                'uses' => 'WorkHourController@exportWorkHourReport',
                'as' => 'timekeeping.invalid.summary',
                'group' => 'Công',
            ]);

            \Route::put('update-status-work-hours/{id}', 'WorkHourController@updateStatusWorkHour');
        });
    }
}
