<?php

namespace GGPHP\Clover;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Clover\Http\Controllers';

    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forBread();
        $this->forAi();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forBread()
    {
        $this->router->group(['middleware' => []], function ($router) {
            //students
            \Route::get('students', [
                'uses' => 'StudentController@index',
                'as' => 'students.index',
            ]);

            \Route::post('import', 'StudentController@import')->name('import');

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
            //students
            \Route::get('students', [
                'uses' => 'StudentController@index',
                'as' => 'students.index',
            ]);

        });
    }
}
