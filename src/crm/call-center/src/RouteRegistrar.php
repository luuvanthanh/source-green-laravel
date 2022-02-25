<?php

namespace GGPHP\Crm\CallCenter;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;
use Illuminate\Support\Facades\Route;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Crm\CallCenter\Http\Controllers';

    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forGuest();
    }

    public function forGuest()
    {
        $this->router->group(['middleware' => []], function ($router) {
            Route::post('/call', 'VoiceController@initiateCall')->name('initiate_call');

            Route::post(
                '/token',
                ['uses' => 'TokenController@newToken', 'as' => 'new-token']
            );

            Route::post(
                '/ticket',
                ['uses' => 'TicketController@newTicket', 'as' => 'new-ticket']
            );
            Route::post(
                '/support/call',
                ['uses' => 'CallController@newCall', 'as' => 'new-call']
            );

            Route::get('/token', 'VoiceController@generateToken');
            Route::post('/incoming/voice/call', 'VoiceController@incomingVoiceCalls');
            Route::view('/dashboard2', 'dashboard');

            Route::post('/call-fail', 'CallController@callFail')->name('call-fail');
            Route::post('/busy', 'CallController@busy')->name('busy');
            Route::post('/recording', 'VoiceController@recording');

            Route::resource('call-centers', 'CallCenterController')->only('index', 'destroy');
        });
    }
}
