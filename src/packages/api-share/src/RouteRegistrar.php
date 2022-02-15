<?php

namespace GGPHP\ApiShare;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\ApiShare\Http\Controllers';

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
        // ApiShare
        \Route::resource('api-shares', 'ApiShareController')->only('index', 'update', 'show', 'store');
        \Route::put('api-share-on-off/{id}', 'ApiShareController@onOffApi');
    }
}
