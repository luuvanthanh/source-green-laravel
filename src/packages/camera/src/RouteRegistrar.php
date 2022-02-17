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
        $this->forVmsCore();
        $this->forShare();
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
        \Route::get('cameras/{id}/playback-get', 'CameraController@playback');
        // Camera playback
        \Route::post('cameras/{id}/playback-stop', 'CameraController@playbackStop');

        // Camera export video
        \Route::post('cameras/{id}/export', 'CameraController@exportVideo');

        \Route::put('cameras/{id}/on-off-record', 'CameraController@onOffRecord');

        \Route::put('cameras/{id}/on-off-stream', 'CameraController@onOffStream');
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forVmsCore()
    {
        \Route::put('cameras-change-log', 'CameraController@cameraChangeLog');
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forShare()
    {
        \Route::get('cameras', 'CameraController@index')->name('cameras-share');
    }
}
