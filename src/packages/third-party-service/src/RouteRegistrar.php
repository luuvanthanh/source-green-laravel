<?php

namespace GGPHP\ThirdPartyService;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\ThirdPartyService\Http\Controllers';

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
        // ThirdPartyService
        \Route::resource('third-party-services', 'ThirdPartyServiceController')->only('index', 'update', 'show');
    }
}
