<?php

namespace GGPHP\Camera;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{

    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Camera\Http\Controllers';

    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forBread();
        $this->forVmsCore();
        $this->forShare();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forBread()
    {
        \Route::get('cameras', [
            'comment' => 'Danh sách camera',
            'uses' => 'CameraController@index',
            'as' => 'VIEW_CAMERA',
            'group' => 'Quản lý camera',
        ])->middleware('permission_for_role:VIEW_CAMERA');

        \Route::post('cameras', [
            'comment' => 'Thêm mới camera',
            'uses' => 'CameraController@store',
            'as' => 'ADD_CAMERA',
            'group' => 'Quản lý camera',
        ])->middleware('permission_for_role:ADD_CAMERA');

        \Route::put('cameras/{id}', [
            'comment' => 'Sửa thông tin camera',
            'uses' => 'CameraController@update',
            'as' => 'EDIT_CAMERA',
            'group' => 'Quản lý camera',
        ])->middleware('permission_for_role:EDIT_CAMERA');

        \Route::get('cameras/{id}', [
            'comment' => 'Thông tin camera',
            'uses' => 'CameraController@show',
            'as' => 'DETAIL_CAMERA',
            'group' => 'Quản lý camera',
        ])->middleware('permission_for_role:DETAIL_CAMERA');

        \Route::delete('cameras/{id}', [
            'comment' => 'Xóa camera',
            'uses' => 'CameraController@destroy',
            'as' => 'DELETE_CAMERA',
            'group' => 'Quản lý camera',
        ])->middleware('permission_for_role:DELETE_CAMERA');

        //disconnect
        \Route::post('cameras/{id}/disconnect', 'CameraController@disconnect');

        // Camera collection
        \Route::post('camera-collections', 'CameraCollectionController@store');

        // Camera playback
        \Route::get('cameras/{id}/playback-get', 'CameraController@playback');
        // Camera playback
        \Route::post('cameras/{id}/playback-stop', 'CameraController@playbackStop');

        // Camera export video
        \Route::post('cameras/{id}/export', 'CameraController@exportVideo');

        \Route::put('cameras/{id}/on-off-record', 'CameraController@onOffRecord');

        \Route::put('cameras/{id}/on-off-stream', 'CameraController@onOffStream');

        \Route::put('cameras/{id}/on-off-ai-service', 'CameraController@onOffAiService');

        \Route::get('cameras/{id}/ai-service', [
            'comment' => 'Chi tiết cấu hình',
            'uses' => 'CameraController@cameraAiService',
            'as' => 'VIEW_SERVICESETTING',
            'group' => 'Cấu hình dịch vụ',
        ])->middleware('permission_for_role:VIEW_SERVICESETTING');

        \Route::put('cameras/{id}/update-coordinates-ai-service', [
            'comment' => 'Hiệu chỉnh cấu hình',
            'uses' => 'CameraController@updateCameraAiService',
            'as' => 'EDIT_SERVICESETTING',
            'group' => 'Cấu hình dịch vụ',
        ])->middleware('permission_for_role:EDIT_SERVICESETTING');
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forVmsCore()
    {
        \Route::put('camera-change-log', 'CameraController@cameraChangeLog');
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forShare()
    {
        \Route::get('cameras', 'CameraController@index')->name('cameras-share');
        \Route::get('cameras-stream', 'CameraController@index')->name('cameras-stream-share');
    }
}
