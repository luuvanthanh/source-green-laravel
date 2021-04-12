<?php

namespace GGPHP\Dismissed;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Dismissed\Http\Controllers';

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
                //dismisseds
                \Route::get('dismisseds', [
                    'uses' => 'DismissedController@index',
                    'as' => 'dismisseds.index',
                ]);

                \Route::post('dismisseds', [
                    'uses' => 'DismissedController@store',
                    'as' => 'dismisseds.store',
                ]);

                \Route::put('dismisseds/{id}', [
                    'uses' => 'DismissedController@update',
                    'as' => 'dismisseds.update',
                ]);

                \Route::get('dismisseds/{id}', [
                    'uses' => 'DismissedController@show',
                    'as' => 'dismisseds.show',
                ]);

                \Route::delete('dismisseds/{id}', [
                    'uses' => 'DismissedController@destroy',
                    'as' => 'dismisseds.destroy',
                ]);
            });

        });
    }
}
