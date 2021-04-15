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
                'as' => 'employees.login',
            ]);
            \Route::post('password/forgot/request', [
                'uses' => 'ForgotPasswordController@getResetToken',
                'as' => 'employees.getResetToken',
            ]);
            \Route::post('password/forgot/reset', [
                'uses' => 'ResetPasswordController@reset',
                'as' => 'employees.getResetToken',
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
            //employees
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
                'as' => 'employees.show',
            ]);

            \Route::get('me', [
                'uses' => 'AuthController@authenticated',
                'as' => 'employees.me.show',
            ]);

        });
    }

    public function forKiosk()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::post('/auth/login', [
                'uses' => 'AuthController@loginByRFID',
                'as' => 'kiosk.employees.login',
            ]);
        });
    }
}
