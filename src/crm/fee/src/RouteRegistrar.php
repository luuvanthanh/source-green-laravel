<?php

namespace GGPHP\Crm\Fee;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;
use Illuminate\Support\Facades\Route;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Crm\Fee\Http\Controllers';

    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forBread();
        $this->forClover();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forClover()
    {
        $this->router->group(['middleware' => []], function ($router) {
            Route::get('school-years', 'SchoolYearController@getSchoolYearClover');
            Route::post('school-years', 'SchoolYearController@store');
            Route::put('school-years/{id}', 'SchoolYearController@update');
            Route::delete('school-years/{id}', 'SchoolYearController@destroy');

            Route::get('class-types', 'ClassTypeController@getClassTypeClover');
            Route::post('class-types', 'ClassTypeController@store');
            Route::put('class-types/{id}', 'ClassTypeController@update');
            Route::delete('class-types/{id}', 'ClassTypeController@destroy');

            Route::get('fees', 'FeeController@getFeeClover');
        });
    }

    public function forBread()
    {
        $this->router->group(['middleware' => []], function ($router) {
            //school years
            Route::get('school-years', 'SchoolYearController@index');
            Route::get('school-years/{id}', 'SchoolYearController@show');
            Route::put('school-years/{id}', 'SchoolYearController@update');
            Route::post('school-years', 'SchoolYearController@store');

            //class type
            Route::get('class-types', 'ClassTypeController@index');
            Route::get('class-types/{id}', 'ClassTypeController@show');
            Route::post('class-types', 'ClassTypeController@store');
            Route::put('class-types/{id}', 'ClassTypeController@update');

            //fee
            Route::resource('fees', 'FeeController')->except('delete');
        });
    }
}
