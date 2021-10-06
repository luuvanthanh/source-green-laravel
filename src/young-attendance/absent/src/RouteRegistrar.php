<?php

namespace GGPHP\YoungAttendance\Absent;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\YoungAttendance\Absent\Http\Controllers';

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
            \Route::get('absent-students', [
                'comment' => 'Danh sách nghỉ phép',
                'uses' => 'AbsentController@index',
                'as' => 'absents.index',
                'group' => 'Nghỉ phép',
            ]);

            \Route::post('absent-students', [
                'comment' => 'Tạo mới nghỉ phép',
                'uses' => 'AbsentController@store',
                'as' => 'absents.store',
                'group' => 'Nghỉ phép',
            ]);

            \Route::put('absent-students/{id}', [
                'comment' => 'Chỉnh sửa nghỉ phép',
                'uses' => 'AbsentController@update',
                'as' => 'absents.update',
                'group' => 'Nghỉ phép',
            ]);

            \Route::get('absent-students/{id}', [
                'comment' => 'Thông tin nghỉ phép',
                'uses' => 'AbsentController@show',
                'as' => 'absents.show',
                'group' => 'Nghỉ phép',
            ]);

            \Route::delete('absent-students/{id}', [
                'comment' => 'Xóa nghỉ phép',
                'uses' => 'AbsentController@destroy',
                'as' => 'absents.destroy',
                'group' => 'Nghỉ phép',
            ]);

            \Route::put('absent-student-confirm/{id}', [
                'comment' => 'Chỉnh sửa nghỉ phép',
                'uses' => 'AbsentController@confirm',
                'as' => 'absents.update',
                'group' => 'Nghỉ phép',
            ]);


            \Route::get('not-refund-student', [
                'uses' => 'AbsentController@notRefundStudent',
            ]);

            //absents types
            \Route::get('absent-type-students', [
                'comment' => 'Danh sách loại nghỉ phép',
                'uses' => 'AbsentTypeController@index',
                'as' => 'absent-types.index',
                'group' => 'Loại nghỉ phép',
            ]);

            \Route::post('absent-type-students', [
                'comment' => 'Tạo mới loại nghỉ phép',
                'uses' => 'AbsentTypeController@store',
                'as' => 'absent-types.store',
                'group' => 'Loại nghỉ phép',
            ]);

            \Route::put('absent-type-students/{id}', [
                'comment' => 'Chỉnh sửa loại nghỉ phép',
                'uses' => 'AbsentTypeController@update',
                'as' => 'absent-types.update',
                'group' => 'Loại nghỉ phép',
            ]);

            \Route::get('absent-type-students/{id}', [
                'comment' => 'Thông tin loại nghỉ phép',
                'uses' => 'AbsentTypeController@show',
                'as' => 'absent-types.show',
                'group' => 'Loại nghỉ phép',
            ]);

            \Route::delete('absent-type-students/{id}', [
                'comment' => 'Xóa loại nghỉ phép',
                'uses' => 'AbsentTypeController@destroy',
                'as' => 'absent-types.destroy',
                'group' => 'Loại nghỉ phép',
            ]);

            //absents reason
            \Route::get('absent-reason-students', [
                'comment' => 'Danh sách lý do nghỉ phép',
                'uses' => 'AbsentReasonController@index',
                'as' => 'absent-reason-students.index',
                'group' => 'Lý do nghỉ phép',
            ]);

            \Route::post('absent-reason-students', [
                'comment' => 'Tạo mới lý do nghỉ phép',
                'uses' => 'AbsentReasonController@store',
                'as' => 'absent-reason-students.store',
                'group' => 'Lý do nghỉ phép',
            ]);

            \Route::put('absent-reason-students/{id}', [
                'comment' => 'Chỉnh sửa lý do nghỉ phép',
                'uses' => 'AbsentReasonController@update',
                'as' => 'absent-reason-students.update',
                'group' => 'Lý do nghỉ phép',
            ]);

            \Route::get('absent-reason-students/{id}', [
                'comment' => 'Thông tin lý do nghỉ phép',
                'uses' => 'AbsentReasonController@show',
                'as' => 'absent-reason-students.show',
                'group' => 'Lý do nghỉ phép',
            ]);

            \Route::delete('absent-reason-students/{id}', [
                'comment' => 'Xóa lý do nghỉ phép',
                'uses' => 'AbsentReasonController@destroy',
                'as' => 'absent-reason-students.destroy',
                'group' => 'Lý do nghỉ phép',
            ]);

            //abents summary
            \Route::get('parent/absent-students', [
                'comment' => 'Tổng hợp nghỉ phép',
                'uses' => 'AbsentController@absentByUser',
                'as' => 'absent.summary',
                'group' => 'Nghỉ phép',
            ]);

            \Route::get('absent-config-times', [
                'uses' => 'AbsentConfigTimeController@index',
            ]);

            \Route::post('absent-config-times', [
                'uses' => 'AbsentConfigTimeController@store',
            ]);

            \Route::get('start-date-by-expected-date', [
                'uses' => 'AbsentConfigTimeController@getStartDateByExpectedDate',
            ]);
        });
    }
}
