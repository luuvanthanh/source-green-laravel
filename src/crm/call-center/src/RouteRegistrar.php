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

            Route::get(
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

            Route::post('/event/callback', 'HistoryCallController@callback');
            Route::post('/answer-call', 'CallController@answerCall');
            Route::post('/end-call', 'CallController@endCall');
            Route::post('/incurred-call', 'CallController@incurredCall');

            Route::post('/incoming/voice/call', 'VoiceController@incomingVoiceCalls');
            Route::view('/dashboard2', 'dashboard');

            Route::post('/call-fail', 'CallController@callFail')->name('call-fail');
            Route::post('/status', 'CallController@status')->name('status');
            Route::post('/recording', 'VoiceController@recording');

            Route::resource('history-calls', 'HistoryCallController')->only('index', 'destroy');

            Route::post('forward', 'CallController@forward');

            Route::post('update-end-call', 'HistoryCallController@updateEndCall');

            Route::resource('manager-calls', 'ManagerCallController');

            Route::post('call-out-going', 'CallController@callOutGoing');

            Route::resource('extensions', 'ExtensionController');

            Route::get('count-call', 'ManagerCallController@countCall');

            Route::post('employee-extension', 'ExtensionController@employeeExtension');
        });
    }
}
