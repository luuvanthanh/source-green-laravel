<?php

namespace GGPHP\Collection;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{

    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Collection\Http\Controllers';

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
        // Collection
        \Route::resource('collections', 'CollectionController');

        // Create video wall from collection
        \Route::post('collections/{collection}/video-walls', 'CollectionController@addVideoWall');
    }
}
