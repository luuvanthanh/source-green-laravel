<?php

namespace GGPHP\Collection;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{

    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Collection\Http\Controllers';

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
        \Route::get('collections', [
            'comment' => 'Danh sách nhóm camera',
            'uses' => 'CollectionController@index',
            'as' => 'VIEW_CAMERAGROUP',
            'group' => 'Quản lý nhóm camera',
        ])->middleware('permission_for_role:VIEW_CAMERAGROUP');

        \Route::post('collections', [
            'comment' => 'Thêm mới nhóm camera',
            'uses' => 'CollectionController@store',
            'as' => 'ADD_CAMERAGROUP',
            'group' => 'Quản lý nhóm camera',
        ])->middleware('permission_for_role:ADD_CAMERAGROUP');

        \Route::put('collections/{id}', [
            'comment' => 'Sửa thông tin nhóm camera',
            'uses' => 'CollectionController@update',
            'as' => 'EDIT_CAMERAGROUP',
            'group' => 'Quản lý nhóm camera',
        ])->middleware('permission_for_role:EDIT_CAMERAGROUP');

        \Route::get('collections/{id}', [
            'comment' => 'Thông tin nhóm camera',
            'uses' => 'CollectionController@update',
            'as' => 'EDIT_CAMERAGROUP',
            'group' => 'Quản lý nhóm camera',
        ])->middleware('permission_for_role:EDIT_CAMERAGROUP');

        \Route::delete('collections/{id}', [
            'comment' => 'Xóa nhóm camera',
            'uses' => 'CollectionController@destroy',
            'as' => 'DELETE_CAMERAGROUP',
            'group' => 'Quản lý nhóm camera',
        ])->middleware('permission_for_role:DELETE_CAMERAGROUP');

        // Create video wall from collection
        \Route::post('collections/{collection}/video-walls', 'CollectionController@addVideoWall');
    }
}
