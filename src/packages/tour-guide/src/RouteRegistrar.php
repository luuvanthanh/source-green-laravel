<?php

namespace GGPHP\TourGuide;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\TourGuide\Http\Controllers';

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
            \Route::resource('tour-guides', 'TourGuideController');

            \Route::get('export-excel-tour-guides', 'TourGuideController@exportExcel');

            \Route::get('tour-guides-export-word/{id}', 'TourGuideController@exportWord');
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
            \Route::get('objects', 'TourGuideController@index');
        });
    }
}
