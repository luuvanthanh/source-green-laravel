<?php

namespace GGPHP\BusRegistration;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\BusRegistration\Http\Controllers';

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
            //bus-registrations
            \Route::get('bus-registrations', [
                'uses' => 'BusRegistrationController@index',
                'as' => 'bus-registrations.index',
            ]);

            \Route::post('bus-registrations', [
                'uses' => 'BusRegistrationController@store',
                'as' => 'bus-registrations.store',
            ]);

            \Route::put('bus-registrations/{id}', [
                'uses' => 'BusRegistrationController@update',
                'as' => 'bus-registrations.update',
            ]);

            \Route::get('bus-registrations/{id}', [
                'uses' => 'BusRegistrationController@show',
                'as' => 'bus-registrations.show',
            ]);

            \Route::delete('bus-registrations/{id}', [
                'uses' => 'BusRegistrationController@destroy',
                'as' => 'bus-registrations.destroy',
            ]);

            \Route::get('bus-registrations-summary', [
                'comment' => 'Tổng hợp công xe bus',
                'uses' => 'BusRegistrationController@busRegistrationSummary',
                'as' => 'bus-registrations.invalid.summary',
            ]);
        });
    }
}
