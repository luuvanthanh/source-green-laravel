<?php

namespace GGPHP\ManualCalculation;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\ManualCalculation\Http\Controllers';

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

            \Route::get('manual-calculations', [
                'uses' => 'ManualCalculationController@index',
            ]);

            \Route::get('manual-calculations/{id}', [
                'uses' => 'ManualCalculationController@show',
            ]);

            \Route::post('manual-calculations', [
                'uses' => 'ManualCalculationController@store',
            ]);
           
        });
    }
}
