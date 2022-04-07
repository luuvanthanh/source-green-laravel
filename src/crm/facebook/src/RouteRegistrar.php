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
        $this->forGuest();
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
                \Route::get('pages', 'FacebookController@getPageFacebook');
                \Route::get('pages/token', 'FacebookController@getPageTokenFacebook');
                \Route::get('pages/conversations', 'FacebookController@getPageConversationFacebook');
                \Route::get('pages/conversations/messages', 'FacebookController@getPageConversationMessageFacebook');
                \Route::post('pages/conversations/send-messages', 'FacebookController@pageConversationSendMessageFacebook');
                \Route::post('pages/post', 'FacebookController@publishPagePost');
                \Route::get('pages/post', 'FacebookController@getPagePost');

                \Route::post('pages/synchronize-conversations', 'ConversationController@synchronizeConversation');
                \Route::post('pages/send-messages', 'PageController@pageSendMessage');
                \Route::get('pages/get-conversations', 'ConversationController@index');
                \Route::get('pages/get-messages', 'MessageController@index');
                \Route::post('pages/seen-conversations', 'ConversationController@seenConversation');
                \Route::post('pages/user-facebook-infos/add-leads', 'UserFacebookInfoController@addLead');
                \Route::get('pages/user-facebook-infos', 'UserFacebookInfoController@index');
                \Route::put('pages/user-facebook-infos/{id}', 'UserFacebookInfoController@update');
                \Route::get('pages/user-facebook-info-tags', 'UserFacebookInfoTagController@index');
                \Route::post('pages/user-facebook-info-tags', 'UserFacebookInfoTagController@store');

                \Route::get('pages/get-pages', 'PageController@index');
                \Route::get('pages/employee-facebooks', 'EmployeeFacebookController@index');
                \Route::post('pages/employee-facebooks', 'EmployeeFacebookController@store');
                \Route::post('pages/specify-conversations', 'UserFacebookInfoController@specifyConversation');
                \Route::post('pages/delete-specify-conversations', 'UserFacebookInfoController@deleteSpecifyConversation');
                \Route::post('pages/delete-all-employee-facebook', 'EmployeeFacebookController@destroyAllEmployeeFacebook');
                \Route::post('pages/refresh-link-files', 'MessageController@refreshLinkFile');
                \Route::get('pages/user-long-tokens', 'FacebookController@userLongToken');
                \Route::post('pages/add-pages', 'PageController@store');
            });
        });
    }

    public function forGuest()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::group(['prefix' => 'facebook'], function () {
                \Route::get('webhook', 'FacebookController@webhook');
                \Route::post('webhook', 'FacebookController@webhookPost');
            });
        });
    }
}
