<?php

namespace GGPHP\TravelAgency;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\TravelAgency\Http\Controllers';

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
            \Route::resource('travel-agencies', 'TravelAgencyController')->only('index', 'show', 'store');
            \Route::post('travel-agencie-tour-guides/{id}', 'TravelAgencyController@addTourGuidesToTravelAgencie');
            \Route::delete('travel-agencie-tour-guides/{id}', 'TravelAgencyController@deleteTourGuidesToTravelAgencie');

            \Route::get('export-excel-travel-agencies', 'TravelAgencyController@exportExcel');

            \Route::get('sync-travel-agencies', 'TravelAgencyController@syncTravelAgency');
        });
    }
}
