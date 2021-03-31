<?php

namespace GGPHP\Absent;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Absent\Http\Controllers';

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
            //absents without leave
            \Route::get('absents/without-leave', [
                'comment' => 'Danh sách nghỉ không phép',
                'uses' => 'AbsentController@absentWithoutLeave',
                'as' => 'absents.absentWithoutLeave.index',
                'group' => 'Nghỉ phép',
            ]);

            //absents
            \Route::get('absents', [
                'comment' => 'Danh sách nghỉ phép',
                'uses' => 'AbsentController@index',
                'as' => 'absents.index',
                'group' => 'Nghỉ phép',
            ]);

            \Route::post('absents', [
                'comment' => 'Tạo mới nghỉ phép',
                'uses' => 'AbsentController@store',
                'as' => 'absents.store',
                'group' => 'Nghỉ phép',
            ]);

            \Route::put('absents/{id}', [
                'comment' => 'Chỉnh sửa nghỉ phép',
                'uses' => 'AbsentController@update',
                'as' => 'absents.update',
                'group' => 'Nghỉ phép',
            ]);

            \Route::get('absents/{id}', [
                'comment' => 'Thông tin nghỉ phép',
                'uses' => 'AbsentController@show',
                'as' => 'absents.show',
                'group' => 'Nghỉ phép',
            ]);

            \Route::delete('absents/{id}', [
                'comment' => 'Xóa nghỉ phép',
                'uses' => 'AbsentController@destroy',
                'as' => 'absents.destroy',
                'group' => 'Nghỉ phép',
            ]);

            //absents types
            \Route::get('absent-types', [
                'comment' => 'Danh sách loại nghỉ phép',
                'uses' => 'AbsentTypeController@index',
                'as' => 'absent-types.index',
                'group' => 'Loại nghỉ phép',
            ]);

            \Route::post('absent-types', [
                'comment' => 'Tạo mới loại nghỉ phép',
                'uses' => 'AbsentTypeController@store',
                'as' => 'absent-types.store',
                'group' => 'Loại nghỉ phép',
            ]);

            \Route::put('absent-types/{id}', [
                'comment' => 'Chỉnh sửa loại nghỉ phép',
                'uses' => 'AbsentTypeController@update',
                'as' => 'absent-types.update',
                'group' => 'Loại nghỉ phép',
            ]);

            \Route::get('absent-types/{id}', [
                'comment' => 'Thông tin loại nghỉ phép',
                'uses' => 'AbsentTypeController@show',
                'as' => 'absent-types.show',
                'group' => 'Loại nghỉ phép',
            ]);

            \Route::delete('absent-types/{id}', [
                'comment' => 'Xóa loại nghỉ phép',
                'uses' => 'AbsentTypeController@destroy',
                'as' => 'absent-types.destroy',
                'group' => 'Loại nghỉ phép',
            ]);

            //absents reason
            \Route::get('absent-reasons', [
                'comment' => 'Danh sách lý do nghỉ phép',
                'uses' => 'AbsentReasonController@index',
                'as' => 'absent-reasons.index',
                'group' => 'Lý do nghỉ phép',
            ]);

            \Route::post('absent-reasons', [
                'comment' => 'Tạo mới lý do nghỉ phép',
                'uses' => 'AbsentReasonController@store',
                'as' => 'absent-reasons.store',
                'group' => 'Lý do nghỉ phép',
            ]);

            \Route::put('absent-reasons/{id}', [
                'comment' => 'Chỉnh sửa lý do nghỉ phép',
                'uses' => 'AbsentReasonController@update',
                'as' => 'absent-reasons.update',
                'group' => 'Lý do nghỉ phép',
            ]);

            \Route::get('absent-reasons/{id}', [
                'comment' => 'Thông tin lý do nghỉ phép',
                'uses' => 'AbsentReasonController@show',
                'as' => 'absent-reasons.show',
                'group' => 'Lý do nghỉ phép',
            ]);

            \Route::delete('absent-reasons/{id}', [
                'comment' => 'Xóa lý do nghỉ phép',
                'uses' => 'AbsentReasonController@destroy',
                'as' => 'absent-reasons.destroy',
                'group' => 'Lý do nghỉ phép',
            ]);

            //abents summary
            \Route::get('user/absents', [
                'comment' => 'Tổng hợp nghỉ phép',
                'uses' => 'AbsentController@absentByUser',
                'as' => 'absent.summary',
                'group' => 'Nghỉ phép',
            ]);
        });
    }
}
