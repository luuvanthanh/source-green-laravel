<?php

namespace GGPHP\Crm\Province;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Crm\Province\Http\Controllers';

    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forBread();
        $this->forGuest();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forGuest()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::resource('districts', 'DistrictController')->only('index');
            \Route::post('import', 'DistrictController@import')->name('import');
        });
    }

    public function forBread()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::resource('citys', 'CityController');
            \Route::resource('districts', 'DistrictController')->except('index');
            \Route::resource('town-wards', 'TownWardController');
            \Route::post('city-sorts', 'CityController@sort');
        });
    }
}
