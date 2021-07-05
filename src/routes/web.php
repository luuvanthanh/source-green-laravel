<?php

use Illuminate\Support\Facades\Route;

Route::group(['middleware' => []], function () {
    \ZK\RouteRegistrar::routes();
});

Route::post('webhook', 'Controller@webhook');
Route::get('webhook', 'Controller@webhook');
