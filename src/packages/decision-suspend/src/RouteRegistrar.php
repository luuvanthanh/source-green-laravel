<?php

namespace GGPHP\DecisionSuspend;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\DecisionSuspend\Http\Controllers';

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
                //decision-suspends
                \Route::get('decision-suspends', [
                    'uses' => 'DecisionSuspendController@index',
                    'as' => 'decision-suspends.index',
                ]);

                \Route::post('decision-suspends', [
                    'uses' => 'DecisionSuspendController@store',
                    'as' => 'decision-suspends.store',
                ]);

                \Route::put('decision-suspends/{id}', [
                    'uses' => 'DecisionSuspendController@update',
                    'as' => 'decision-suspends.update',
                ]);

                \Route::get('decision-suspends/{id}', [
                    'uses' => 'DecisionSuspendController@show',
                    'as' => 'decision-suspends.show',
                ]);

                \Route::delete('decision-suspends/{id}', [
                    'uses' => 'DecisionSuspendController@destroy',
                    'as' => 'decision-suspends.destroy',
                ]);
            });

        });
    }
}
