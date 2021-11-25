<?php

namespace GGPHP\CameraServer;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\CameraServer\Http\Controllers';

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
        // CameraServer
        \Route::resource('camera-servers', 'CameraServerController');
        \Route::post('camera-servers/uuid', 'CameraServerController@uuid');
    }
}
