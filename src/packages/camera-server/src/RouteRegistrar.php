<?php

namespace GGPHP\CameraServer;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\CameraServer\Http\Controllers';

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
        // CameraServer
        \Route::get('camera-servers', [
            'comment' => 'Danh sách camera server',
            'uses' => 'CameraServerController@index',
            'as' => 'VIEW_CAMERASERVER',
            'group' => 'Quản lý camera server',
        ])->middleware('permission_for_role:VIEW_CAMERASERVER');

        \Route::post('camera-servers', [
            'comment' => 'Thêm mới camera server',
            'uses' => 'CameraServerController@store',
            'as' => 'ADD_CAMERASERVER',
            'group' => 'Quản lý camera server',
        ])->middleware('permission_for_role:ADD_CAMERASERVER');

        \Route::put('camera-servers/{id}', [
            'comment' => 'Sửa thông tin camera server',
            'uses' => 'CameraServerController@update',
            'as' => 'EDIT_CAMERASERVER',
            'group' => 'Quản lý camera server',
        ])->middleware('permission_for_role:EDIT_CAMERASERVER');

        \Route::get('camera-servers/{id}', [
            'comment' => 'Thông tin camera server',
            'uses' => 'CameraServerController@update',
            'as' => 'EDIT_CAMERASERVER',
            'group' => 'Quản lý camera server',
        ])->middleware('permission_for_role:EDIT_CAMERASERVER');

        \Route::delete('camera-servers/{id}', [
            'comment' => 'Xóa camera server',
            'uses' => 'CameraServerController@destroy',
            'as' => 'DELETE_CAMERASERVER',
            'group' => 'Quản lý camera server',
        ])->middleware('permission_for_role:DELETE_CAMERASERVER');


        \Route::post('camera-servers/{id}/active-vms-core', 'CameraServerController@activeVmsCore');
        \Route::post('camera-servers/{id}/active-vms-core-not-camera', 'CameraServerController@activeVmsCoreNotCamera');
        \Route::post('camera-servers/{id}/deactivation-vms-core', 'CameraServerController@deactivationVmsCore');
        \Route::post('camera-servers/uuid', 'CameraServerController@uuid');

        \Route::post('camera-servers/{id}/transfer-cameras', 'CameraServerController@transferCamera');

        \Route::post('camera-servers/{id}/change-status', 'CameraServerController@changeStatus');
    }
}
