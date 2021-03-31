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
        $this->forUser();
        $this->forKiosk();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forGuest()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::post('oauth/token', [
                'uses' => 'AccessTokenController@issueToken',
                'as' => 'users.login',
            ]);
            \Route::post('password/forgot/request', [
                'uses' => 'ForgotPasswordController@getResetToken',
                'as' => 'users.getResetToken',
            ]);
            \Route::post('password/forgot/reset', [
                'uses' => 'ResetPasswordController@reset',
                'as' => 'users.getResetToken',
            ]);
        });
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forUser()
    {
        $this->router->group(['middleware' => []], function ($router) {
            //users
            \Route::get('users', [
                'comment' => 'Danh sách người dùng',
                'uses' => 'UserController@index',
                'as' => 'users.index',
                'group' => 'Người dùng',
            ]);

            \Route::post('users', [
                'comment' => 'Tạo mới người dùng',
                'uses' => 'UserController@store',
                'as' => 'users.store',
                'group' => 'Người dùng',
            ]);

            \Route::put('users/{id}', [
                'comment' => 'Chỉnh sửa người dùng',
                'uses' => 'UserController@update',
                'as' => 'users.update',
                'group' => 'Người dùng',
            ]);

            \Route::get('users/{id}', [
                'comment' => 'Thông tin người dùng',
                'uses' => 'UserController@show',
                'as' => 'users.show',
                'group' => 'Người dùng',
            ]);

            \Route::get('me', [
                'comment' => 'Thông tin tài khoản',
                'uses' => 'AuthController@authenticated',
                'as' => 'users.me.show',
                'group' => 'Người dùng',
            ]);

        });
    }

    public function forKiosk()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::post('/auth/login', [
                'uses' => 'AuthController@loginByRFID',
                'as' => 'kiosk.users.login',
            ]);
        });
    }
}
