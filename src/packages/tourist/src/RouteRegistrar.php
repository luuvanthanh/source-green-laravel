<?php

namespace GGPHP\Tourist;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Tourist\Http\Controllers';

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
        // Tourist
        \Route::resource('tourists', 'TouristController');
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forAi()
    {
        // Tourist
        \Route::resource('tourists', 'TouristController')->only('store');
    }
}
