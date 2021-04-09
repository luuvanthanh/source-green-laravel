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
            \Route::get('employees', [
                'uses' => 'UserController@index',
                'as' => 'employees.index',
            ]);

            \Route::post('employees', [
                'uses' => 'UserController@store',
                'as' => 'employees.store',
            ]);

            \Route::put('employees/{id}', [
                'uses' => 'UserController@update',
                'as' => 'employees.update',
            ]);

            \Route::get('employees/{id}', [
                'uses' => 'UserController@show',
                'as' => 'users.show',
            ]);

            \Route::get('me', [
                'uses' => 'AuthController@authenticated',
                'as' => 'users.me.show',
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
