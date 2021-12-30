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

        \Route::resource('users', 'UserController')->except(['destroy']);
        \Route::get('session', 'AuthController@logged')->name('logged');
        \Route::post('logout', 'AuthController@logout');
        \Route::post('password/change', 'ChangePasswordController@changePassword');

        \Route::get('me', 'AuthController@authenticated');

        \Route::put('user-lock/{id}', 'UserController@lockUser');

        \Route::post('users/player/{id}', [
            'uses' => 'UserController@addPlayer',
        ]);
    }
}
