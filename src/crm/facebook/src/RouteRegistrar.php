<?php

namespace GGPHP\Crm\Facebook;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Crm\Facebook\Http\Controllers';

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
            \Route::group(['prefix' => 'facebook'], function () {
                \Route::get('webhook', 'FacebookController@webhook');
                \Route::post('webhook', 'FacebookController@webhookPost');
                \Route::get('pages', 'FacebookController@getPageFacebook');
                \Route::get('pages/token', 'FacebookController@getPageTokenFacebook');
                \Route::get('pages/conversations', 'FacebookController@getPageConversationFacebook');
                \Route::get('pages/conversations/messages', 'FacebookController@getPageConversationMessageFacebook');
                \Route::post('pages/conversations/send-messages', 'FacebookController@pageConversationSendMessageFacebook');

                \Route::get('test', 'FacebookController@test');
            });
        });
    }
}
