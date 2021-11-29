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
        \Route::post('users/roles/{id}', 'UserController@updateRoleUser')->name('users.update.role');
        \Route::post('users/permissions/{id}', 'UserController@updatePermissionUser');

        // User collection
        \Route::post('user-collections', 'UserCollectionController@assignOrRemoveUser');

        \Route::delete('user-collections', 'UserCollectionController@removeUser');

        \Route::get('users/{id}/collections', 'UserCollectionController@assigned');

        \Route::get('me', 'AuthController@authenticated');

        \Route::put('user-lock/{id}', 'UserController@lockUser');
    }
}
