<?php

namespace GGPHP\Category;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Category\Http\Controllers';

    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forBread();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forBread()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::resource('tourist-destinations', 'TouristDestinationController');
            \Route::resource('event-types', 'EventTypeController')->only('index');
            \Route::resource('provinces', 'ProvinceController')->only('index');
            \Route::resource('languages', 'LanguageController')->only('index', 'store');
            \Route::post('import-provinces', 'ProvinceController@importProvince');
            \Route::resource('object-types', 'ObjectTypeController');
        });
    }
}
