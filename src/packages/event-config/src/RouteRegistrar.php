<?php

namespace GGPHP\EventConfig;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\EventConfig\Http\Controllers';

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
        \Route::get('event-configs', [
            'comment' => 'Chi tiết cấu hình',
            'uses' => 'EventConfigController@index',
            'as' => 'VIEW_EVENTSETTING',
            'group' => 'Cấu hình sự kiện',
        ])->middleware('permission_for_role:VIEW_EVENTSETTING');

        \Route::post('event-configs', [
            'comment' => 'Hiệu chỉnh cấu hình',
            'uses' => 'EventConfigController@store',
            'as' => 'EDIT_EVENTSETTING',
            'group' => 'Cấu hình sự kiện',
        ])->middleware('permission_for_role:EDIT_EVENTSETTING');
    }
}
