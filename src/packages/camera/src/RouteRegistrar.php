<?php

namespace GGPHP\Camera;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{

    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Camera\Http\Controllers';

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
        \Route::resource('cameras', 'CameraController');

        // Camera collection
        \Route::post('camera-collections', 'CameraCollectionController@store');

        // Camera playback
        \Route::post('cameras/{camera}/playback', 'CameraMediaController@playback');

        // Camera export video
        \Route::post('cameras/{camera}/export', 'CameraMediaController@exportVideo');
    }
}
