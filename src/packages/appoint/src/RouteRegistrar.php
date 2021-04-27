<?php

namespace GGPHP\Appoint;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Appoint\Http\Controllers';

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
            \Route::group(['middleware' => []], function () {
                //appoints
                \Route::get('appoints', [
                    'uses' => 'AppointController@index',
                    'as' => 'appoints.index',
                ]);

                \Route::post('appoints', [
                    'uses' => 'AppointController@store',
                    'as' => 'appoints.store',
                ]);

                \Route::put('appoints/{id}', [
                    'uses' => 'AppointController@update',
                    'as' => 'appoints.update',
                ]);

                \Route::get('appoints/{id}', [
                    'uses' => 'AppointController@show',
                    'as' => 'appoints.show',
                ]);

                \Route::delete('appoints/{id}', [
                    'uses' => 'AppointController@destroy',
                    'as' => 'appoints.destroy',
                ]);
            });

        });
    }
}
