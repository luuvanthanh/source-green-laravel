<?php

namespace GGPHP\SystemConfig;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\SystemConfig\Http\Controllers';

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
        // SystemConfig
        \Route::resource('system-configs', 'SystemConfigController');

        \Route::put('receive-email', 'SystemConfigController@updateReceiveEmail');

        \Route::put('on-off-teamplate-email/{id}', 'SystemConfigController@onOffTeamplateEmail');
        \Route::put('teamplate-emails/{id}', 'SystemConfigController@updateTeamplateEmail');
    }
}
