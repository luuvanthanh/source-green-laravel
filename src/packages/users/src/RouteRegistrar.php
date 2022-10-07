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
        $this->forUser();
        $this->forAi();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forGuest()
    {
        $this->router->group(['middleware' => []], function ($router) {
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

            \Route::put('employee/storage/{id}', [
                'uses' => 'UserController@storage',
                'as' => 'employees.show',
            ]);
            \Route::post('send-employee-accountants', [
                'uses' => 'UserController@sendEmployeeAccountant',
            ]);

            \Route::post('sync-employees', [
                'uses' => 'UserController@syncEmployee',
                'as' => 'employees.show',
            ]);

            \Route::put('update-status-employees/{id}', [
                'uses' => 'UserController@updateStatusEmployee',
            ]);

            \Route::get('update-last-name', [
                'uses' => 'UserController@updateLastName',
            ]);

            \Route::get('report-employee-info', [
                'uses' => 'UserController@reportEmployeeInfo',
            ]);
        });
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forAi()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::get('employees', [
                'uses' => 'UserController@index',
                'as' => 'employees.index',
            ]);
        });
    }
}
