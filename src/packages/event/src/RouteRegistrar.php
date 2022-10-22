<?php

namespace GGPHP\Event;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Event\Http\Controllers';

    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forBread();
        $this->forAi();
        $this->forGuest();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forBread()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::get('events', [
                'comment' => 'Danh sách sự kiện',
                'uses' => 'EventController@index',
                'as' => 'VIEW_EVENT|VIEW_TRACKEDEVENT',
                'group' => 'Quản lý sự kiện',
            ])->middleware('permission_for_role:VIEW_EVENT|VIEW_TRACKEDEVENT');

            \Route::get('events/{id}', [
                'comment' => 'Chi tiết sự kiện',
                'uses' => 'EventController@show',
            ]);

            \Route::post('event-handle/{id}', [
                'comment' => 'Xử lý sự kiện',
                'uses' => 'EventController@handleEvent',
                'as' => 'EDIT_EVENT',
                'group' => 'Quản lý sự kiện',
            ])->middleware('permission_for_role:EDIT_EVENT');

            \Route::put('event-handle/{id}', [
                'comment' => 'Cập nhật xử lý sự kiện',
                'uses' => 'EventController@updateHandleEvent',
                'as' => 'EDIT_TRACKEDEVENT',
                'group' => 'Quản lý sự kiện',
            ])->middleware('permission_for_role:EDIT_TRACKEDEVENT');

            \Route::post('event-handle-muti/{id}', 'EventController@handleEventMuti')->middleware('permission_for_role:EDIT_EVENT');

            \Route::get('event-export-word/{id}', 'EventController@exportWord');

            \Route::post('event-add-object/{id}', 'EventController@addObject');

            \Route::post('event-handle-flow/{id}', 'EventController@handleEventFlow');
        });
    }


    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forAi()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::post('events', 'EventController@storeAi');
        });
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forGuest()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::get('export-excel-events', 'EventController@exportExcel');
        });
    }
}
