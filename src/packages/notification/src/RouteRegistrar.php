<?php

namespace GGPHP\Notification;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Notification\Http\Controllers';

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
            \Route::group(['middleware' => []], function () {
                //notifications
                \Route::get('notifications', [
                    'uses' => 'NotificationController@index',
                    'as' => 'notifications.index',
                ]);

                \Route::post('notifications/{id}/read', [
                    'uses' => 'NotificationController@read',
                    'as' => 'notifications.read',
                ]);

                \Route::get('notifications/read-all/{id}', [
                    'uses' => 'NotificationController@readAll',
                    'as' => 'notifications.readAll',
                ]);
            });
        });
    }
}
