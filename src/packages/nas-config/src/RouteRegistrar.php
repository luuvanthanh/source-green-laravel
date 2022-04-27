<?php

namespace GGPHP\NasConfig;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\NasConfig\Http\Controllers';

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
        \Route::get('nas-configs', [
            'comment' => 'Chi tiết cấu hình nas',
            'uses' => 'NasConfigController@index',
            'as' => 'VIEW_NASSETTING',
            'group' => 'Cấu hình NAS',
        ])->middleware('permission_for_role:VIEW_NASSETTING');

        \Route::post('nas-configs', [
            'comment' => 'Hiệu chỉnh cấu hình',
            'uses' => 'NasConfigController@store',
            'as' => 'EDIT_NASSETTING',
            'group' => 'Cấu hình NAS',
        ])->middleware('permission_for_role:EDIT_NASSETTING');
    }
}
