<?php

namespace GGPHP\ShiftSchedule;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\ShiftSchedule\Http\Controllers';

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
            //shifts
            \Route::get('shifts', [
                'comment' => 'Danh sách ca',
                'uses' => 'ShiftController@index',
                'as' => 'shifts.index',
                'group' => 'Ca làm việc',
            ]);

            \Route::post('shifts', [
                'comment' => 'Tạo mới ca',
                'uses' => 'ShiftController@store',
                'as' => 'shifts.store',
                'group' => 'Ca làm việc',
            ]);

            \Route::put('shifts/{id}', [
                'comment' => 'Chỉnh sửa ca',
                'uses' => 'ShiftController@update',
                'as' => 'shifts.update',
                'group' => 'Ca làm việc',
            ]);

            \Route::get('shifts/{id}', [
                'comment' => 'Thông tin ca',
                'uses' => 'ShiftController@show',
                'as' => 'shifts.show',
                'group' => 'Ca làm việc',
            ]);

            \Route::delete('shifts/{id}', [
                'comment' => 'Xóa ca',
                'uses' => 'ShiftController@destroy',
                'as' => 'shifts.destroy',
                'group' => 'Ca làm việc',
            ]);

            \Route::put('active-status-shift/{id}', [
                'uses' => 'ShiftController@activeStatusShift',
                'as' => 'shifts.destroy',
            ]);

            \Route::get('shift-users/{id}', [
                'uses' => 'ScheduleController@getShiftUser',
            ]);

            //schedule
            \Route::post('schedules', [
                'comment' => 'Tạo/Sửa lịch làm việc',
                'uses' => 'ScheduleController@store',
                'as' => 'schedules.store',
                'group' => 'Lịch làm việc',
            ]);

            \Route::delete('schedules/{id}', [
                'comment' => 'Xóa lịch làm việc',
                'uses' => 'ScheduleController@destroy',
                'as' => 'schedules.destroy',
                'group' => 'Lịch làm việc',
            ]);

            \Route::get('schedule-employees', [
                'comment' => 'Danh sách lịch làm việc theo nhân viên',
                'uses' => 'ScheduleController@scheduleUser',
                'as' => 'schedules.schedule-employee.index',
                'group' => 'Lịch làm việc',
            ]);

            //repeat
            \Route::group(['prefix' => 'schedules/repeat'], function () {
                \Route::delete('delete/{id}', [
                    'comment' => 'Xóa ca lặp lại',
                    'uses' => 'ScheduleController@deleteScheduleRepeat',
                    'as' => 'schedule.repeat.delete',
                    'group' => 'Lịch làm việc',
                ]);
            });

            \Route::get('division-shifts', [
                'comment' => 'Tạo mới ca',
                'uses' => 'DivisionShiftController@index',
                'as' => 'division-shifts.store',
                'group' => 'Ca làm việc',
            ]);

            \Route::post('division-shifts', [
                'comment' => 'Tạo mới ca',
                'uses' => 'DivisionShiftController@store',
                'as' => 'division-shifts.store',
                'group' => 'Ca làm việc',
            ]);

            \Route::put('division-shifts/{id}', [
                'comment' => 'Chỉnh sửa ca',
                'uses' => 'DivisionShiftController@update',
                'as' => 'division-shifts.update',
                'group' => 'Ca làm việc',
            ]);

            \Route::get('division-shifts/{id}', [
                'comment' => 'Thông tin ca',
                'uses' => 'DivisionShiftController@show',
                'as' => 'division-shifts.show',
                'group' => 'Ca làm việc',
            ]);

        });
    }
}
