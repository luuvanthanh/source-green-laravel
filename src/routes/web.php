<?php

use App\Http\Controllers\VoiceController;
use Illuminate\Support\Facades\Route;

Route::view('/', 'call');

Route::post('/call', 'VoiceController@initiateCall')->name('initiate_call');

Route::post(
    '/token',
    ['uses' => 'TokenController@newToken', 'as' => 'new-token']
);
Route::get(
    '/dashboard',
    ['uses' => 'DashboardController@dashboard', 'as' => 'dashboard']
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

