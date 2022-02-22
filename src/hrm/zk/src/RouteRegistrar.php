<?php

namespace ZK;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\ZK\Http\Controllers';
    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forIclock();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forIclock()
    {
        $this->router->group(['prefix' => 'iclock', 'middleware' => []], function ($router) {
            $router->get('/cdata', [
                'uses' => 'IclockController@deviceGetSetting',
                'as' => 'zk.iclock.deviceGetSetting',
            ]);

            $router->post('/devicecmd', [
                'uses' => 'IclockController@deviceGetCommand',
                'as' => 'zk.iclock.deviceGetCommand',
            ]);

            $router->get('/getrequest', [
                'uses' => 'IclockController@sentToDevice',
                'as' => 'zk.iclock.sentToDevice',
            ]);

            $router->post('/cdata', [
                'uses' => 'IclockController@receiveFromDevice',
                'as' => 'zk.iclock.receiveFromDevice',
            ]);
        });
    }
}
