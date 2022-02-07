<?php

namespace GGPHP\Crm\Fee;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

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
        $this->forHrm();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forHrm()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::post('school-years', 'SchoolYearController@store');
            \Route::put('school-years/{id}', 'SchoolYearController@update');
            \Route::delete('school-years/{id}', 'SchoolYearController@destroy');
        });
    }

    public function forBread()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::get('school-years', 'SchoolYearController@index');
            \Route::get('school-years/{id}', 'SchoolYearController@show');
        });
    }
}
