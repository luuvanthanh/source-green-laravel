<?php

namespace GGPHP\Users;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Users\Http\Controllers';

    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forGuest();
        $this->forBread();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forGuest()
    {
        \Route::post('oauth/token', 'AccessTokenController@issueToken')->name('login');
        \Route::post('password/forgot/request', 'ForgotPasswordController@getResetToken');
        \Route::post('password/forgot/reset', 'ResetPasswordController@reset');

        \Route::get('login/egov', 'AuthController@egovLogin');
        \Route::get('callback/egov', 'AuthController@egovLoginCallback');
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forBread()
    {
        \Route::put('users/me', 'UserController@updateProfile');
        \Route::delete('users/{id}', 'UserController@destroy');

        \Route::get('users', [
            'comment' => 'Danh sách người dùng',
            'uses' => 'UserController@index',
            'as' => 'VIEW_USER',
            'group' => 'Quản lý người dùng',
        ])->middleware('permission_for_role:VIEW_USER');

        \Route::post('users', [
            'comment' => 'Thêm mới người dùng',
            'uses' => 'UserController@store',
            'as' => 'ADD_USER',
            'group' => 'Quản lý người dùng',
        ])->middleware('permission_for_role:ADD_USER');

        \Route::put('users/{id}', [
            'comment' => 'Sửa thông tin người dùng',
            'uses' => 'UserController@update',
            'as' => 'EDIT_USER',
            'group' => 'Quản lý người dùng',
        ])->middleware('permission_for_role:EDIT_USER');

        \Route::get('users/{id}', [
            'comment' => 'Thông tin người dùng',
            'uses' => 'UserController@show',
            'as' => 'DETAIL_USER',
            'group' => 'Quản lý người dùng',
        ])->middleware('permission_for_role:DETAIL_USER');

        \Route::delete('users/{id}', [
            'comment' => 'Xóa người dùng',
            'uses' => 'UserController@destroy',
            'as' => 'DELETE_USER',
            'group' => 'Quản lý người dùng',
        ])->middleware('permission_for_role:DELETE_USER');

        \Route::get('session', 'AuthController@logged')->name('logged');
        \Route::post('logout', 'AuthController@logout');
        \Route::post('password/change', 'ChangePasswordController@changePassword');
        \Route::post('password/change/first', 'ChangePasswordController@changePasswordFirst');

        \Route::get('me', 'AuthController@authenticated');

        \Route::put('user-lock/{id}', 'UserController@lockUser');

        \Route::post('users/player/{id}', [
            'uses' => 'UserController@addPlayer',
        ]);
    }
}
