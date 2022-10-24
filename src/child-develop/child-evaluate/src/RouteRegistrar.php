<?php

namespace GGPHP\ChildDevelop\ChildEvaluate;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\ChildDevelop\ChildEvaluate\Http\Controllers';

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
            \Route::resource('child-evaluates', 'ChildEvaluateController');

            \Route::put('update-is-use/{id}', 'ChildEvaluateController@updateIsUse');

            \Route::get('get-const', 'ChildEvaluateController@getConst');

            \Route::get('merge-data', 'ChildEvaluateController@mergeData');
        });
    }
}
