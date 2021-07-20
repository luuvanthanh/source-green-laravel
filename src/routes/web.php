<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::group(['middleware' => []], function () {
    \ZK\RouteRegistrar::routes();
});

Route::get('zalo', 'Controller@zalo');
Route::post('login/zalo', 'Controller@zaloLogin');
Route::post('webhook-zalo', 'Controller@webhookZalo');
