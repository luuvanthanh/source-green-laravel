<?php

namespace GGPHP\ConfigReceiveNotification;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\ConfigReceiveNotification\Http\Controllers';

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
            \Route::resource('config-receive-notifications', 'ConfigReceiveNotificationController');
            \Route::get('config-receive-notification-by-users', 'ConfigReceiveNotificationController@configReceiveNotificationByUser');
            \Route::post('turn-on-off-config-receive-notifications', 'ConfigReceiveNotificationController@turnOnOffConfigReceiveNotification');
        });
    }
}
