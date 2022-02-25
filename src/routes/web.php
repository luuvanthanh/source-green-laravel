<?php

use App\Http\Controllers\VoiceController;
use Illuminate\Support\Facades\Route;

Route::view('/', 'welcome');

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

Route::get('/token', [VoiceController::class, 'generateToken']);
Route::post('/incoming/voice/call', [VoiceController::class, 'incomingVoiceCalls']);
Route::view('/dashboard2', 'dashboard');
