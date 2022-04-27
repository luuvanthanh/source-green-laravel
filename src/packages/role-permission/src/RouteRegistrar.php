<?php

namespace GGPHP\RolePermission;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\RolePermission\Http\Controllers';

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
            //permissions
            \Route::get('permissions', [
                'comment' => 'Danh sách quyền',
                'uses' => 'PermissionController@index',
            ]);

            \Route::get('roles', [
                'comment' => 'Danh sách vai trò',
                'uses' => 'RoleController@index',
                'as' => 'VIEW_ROLE',
                'group' => 'Vai trò',
            ])->middleware('permission_for_role:VIEW_ROLE');

            \Route::post('roles', [
                'comment' => 'Tạo mới vai trò',
                'uses' => 'RoleController@store',
                'as' => 'ADD_ROLE',
                'group' => 'Vai trò',
            ])->middleware('permission_for_role:ADD_ROLE');

            \Route::put('roles/{id}', [
                'comment' => 'Chỉnh sửa vai trò',
                'uses' => 'RoleController@update',
                'as' => 'EDIT_ROLE',
                'group' => 'Vai trò',
            ])->middleware('permission_for_role:EDIT_ROLE');

            \Route::get('roles/{id}', [
                'comment' => 'Thông tin vai trò',
                'uses' => 'RoleController@show',
                'as' => 'DETAIL_ROLE',
                'group' => 'Vai trò',
            ])->middleware('permission_for_role:DETAIL_ROLE');

            \Route::delete('roles/{id}', [
                'comment' => 'Xóa vai trò',
                'uses' => 'RoleController@destroy',
                'as' => 'DELETE_ROLE',
                'group' => 'Vai trò',
            ])->middleware('permission_for_role:DELETE_ROLE');
        });
    }
}
