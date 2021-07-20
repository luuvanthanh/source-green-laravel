<?php

namespace GGPHP\YoungAttendance\ShiftSchedule;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\YoungAttendance\ShiftSchedule\Http\Controllers';

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
            \Route::get('shift-students', [
                'comment' => 'Danh sách ca',
                'uses' => 'ShiftController@index',
                'as' => 'shifts.index',
                'group' => 'Ca làm việc',
            ]);

            \Route::post('shift-students', [
                'comment' => 'Tạo mới ca',
                'uses' => 'ShiftController@store',
                'as' => 'shifts.store',
                'group' => 'Ca làm việc',
            ]);

            \Route::put('shift-students/{id}', [
                'comment' => 'Chỉnh sửa ca',
                'uses' => 'ShiftController@update',
                'as' => 'shifts.update',
                'group' => 'Ca làm việc',
            ]);

            \Route::get('shift-students/{id}', [
                'comment' => 'Thông tin ca',
                'uses' => 'ShiftController@show',
                'as' => 'shifts.show',
                'group' => 'Ca làm việc',
            ]);

            \Route::delete('shift-students/{id}', [
                'comment' => 'Xóa ca',
                'uses' => 'ShiftController@destroy',
                'as' => 'shifts.destroy',
                'group' => 'Ca làm việc',
            ]);

            \Route::put('active-status-shift-students/{id}', [
                'uses' => 'ShiftController@activeStatusShift',
                'as' => 'shifts.destroy',
            ]);

            //schedule
            \Route::post('schedule-students', [
                'comment' => 'Tạo/Sửa lịch làm việc',
                'uses' => 'ScheduleController@store',
                'as' => 'schedules.store',
                'group' => 'Lịch làm việc',
            ]);

            \Route::delete('schedule-students/{id}', [
                'comment' => 'Xóa lịch làm việc',
                'uses' => 'ScheduleController@destroy',
                'as' => 'schedules.destroy',
                'group' => 'Lịch làm việc',
            ]);

            \Route::get('schedule-students', [
                'comment' => 'Danh sách lịch làm việc theo học sinh',
                'uses' => 'ScheduleController@scheduleUser',
                'as' => 'schedules.schedule-employee.index',
                'group' => 'Lịch làm việc',
            ]);

            //repeat
            \Route::group(['prefix' => 'schedule-students/repeat'], function () {
                \Route::delete('delete/{id}', [
                    'comment' => 'Xóa ca lặp lại',
                    'uses' => 'ScheduleController@deleteScheduleRepeat',
                    'as' => 'schedule.repeat.delete',
                    'group' => 'Lịch làm việc',
                ]);
            });
        });
    }
}
