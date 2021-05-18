<?php

namespace GGPHP\ResignationDecision;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\ResignationDecision\Http\Controllers';

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
                //resignation-decisions
                \Route::get('resignation-decisions', [
                    'uses' => 'ResignationDecisionController@index',
                    'as' => 'resignation-decisions.index',
                ]);

                \Route::post('resignation-decisions', [
                    'uses' => 'ResignationDecisionController@store',
                    'as' => 'resignation-decisions.store',
                ]);

                \Route::put('resignation-decisions/{id}', [
                    'uses' => 'ResignationDecisionController@update',
                    'as' => 'resignation-decisions.update',
                ]);

                \Route::get('resignation-decisions/{id}', [
                    'uses' => 'ResignationDecisionController@show',
                    'as' => 'resignation-decisions.show',
                ]);

                \Route::delete('resignation-decisions/{id}', [
                    'uses' => 'ResignationDecisionController@destroy',
                    'as' => 'resignation-decisions.destroy',
                ]);

                \Route::get('resignation-decisions-export-word/{id}', [
                    'uses' => 'ResignationDecisionController@exportWord',
                    'as' => 'resignation-decisions.word.export',
                ]);
            });

        });
    }
}
