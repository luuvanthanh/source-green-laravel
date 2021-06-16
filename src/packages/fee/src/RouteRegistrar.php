<?php

namespace GGPHP\Fee;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Fee\Http\Controllers';

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
                'uses' => 'FeeController@index',
                'as' => 'work-hours.index',
                'group' => 'Công bù giờ',
            ]);

            \Route::post('work-hours', [
                'comment' => 'Tạo mới công bù giờ',
                'uses' => 'FeeController@store',
                'as' => 'work-hours.store',
                'group' => 'Công bù giờ',
            ]);

            \Route::put('work-hours/{id}', [
                'comment' => 'Chỉnh sửa công bù giờ',
                'uses' => 'FeeController@update',
                'as' => 'work-hours.update',
                'group' => 'Công bù giờ',
            ]);

            \Route::get('work-hours/{id}', [
                'comment' => 'Thông tin công bù giờ',
                'uses' => 'FeeController@show',
                'as' => 'work-hours.show',
                'group' => 'Công bù giờ',
            ]);

            \Route::delete('work-hours/{id}', [
                'comment' => 'Xóa công bù giờ',
                'uses' => 'FeeController@destroy',
                'as' => 'work-hours.destroy',
                'group' => 'Công bù giờ',
            ]);

            \Route::get('work-hours-summary', [
                'comment' => 'Tổng hợp công ngoài giờ',
                'uses' => 'FeeController@feeSummary',
                'as' => 'timekeeping.invalid.summary',
                'group' => 'Công',
            ]);

            \Route::get('work-hours-summary-export', [
                'comment' => 'Tổng hợp công ngoài giờ',
                'uses' => 'FeeController@exportFeeReport',
                'as' => 'timekeeping.invalid.summary',
                'group' => 'Công',
            ]);
        });
    }
}
