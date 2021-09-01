<?php

namespace GGPHP\Crm\Zalo;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Crm\Zalo\Http\Controllers';

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
            \Route::group(['prefix' => 'zalo'], function () {
                \Route::get('zalo-login', 'ZaloController@zalo');
                \Route::get('zalo-callback', 'ZaloController@zaloCallBack');

                \Route::post('webhook-zalo', 'ZaloController@webhookZalo');

                \Route::get('zalo-redirect', 'ZaloController@zaloRedirect');

                \Route::get('zalo-test', 'ZaloController@zaloTest');
            });
        });
    }
}
