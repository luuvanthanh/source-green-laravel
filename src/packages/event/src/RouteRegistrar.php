<?php

namespace GGPHP\Event;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Event\Http\Controllers';

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
            \Route::resource('events', 'EventController');

            \Route::post('event-handle/{id}', 'EventController@handleEvent');

            \Route::post('event-handle-muti/{id}', 'EventController@handleEventMuti');
        });
    }
}
