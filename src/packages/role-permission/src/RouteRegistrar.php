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
                'as' => 'permissions.index',
                'group' => 'Quyền',
                'is_system' => true,
            ]);

            //roles
            \Route::put('permissions-for-role', [
                'comment' => 'Thêm quyền cho vai trò',
                'uses' => 'RoleController@updatePermissionForRole',
                'as' => 'roles.permission.update',
                'group' => 'Vai trò',
                'is_system' => true,
            ]);
            \Route::get('roles', [
                'comment' => 'Danh sách vai trò',
                'uses' => 'RoleController@index',
                'as' => 'roles.index',
                'group' => 'Vai trò',
                'is_system' => true,
            ]);
            \Route::post('roles', [
                'comment' => 'Tạo mới vai trò',
                'uses' => 'RoleController@store',
                'as' => 'roles.store',
                'group' => 'Vai trò',
                'is_system' => true,
            ]);
            \Route::put('roles/{id}', [
                'comment' => 'Chỉnh sửa vai trò',
                'uses' => 'RoleController@update',
                'as' => 'roles.update',
                'group' => 'Vai trò',
                'is_system' => true,
            ]);
            \Route::get('roles/{id}', [
                'comment' => 'Thông tin vai trò',
                'uses' => 'RoleController@show',
                'as' => 'roles.show',
                'group' => 'Vai trò',
                'is_system' => true,
            ]);
        });
    }
}
