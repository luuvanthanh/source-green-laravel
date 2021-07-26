<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::group(['middleware' => []], function () {
    \ZK\RouteRegistrar::routes();
});
