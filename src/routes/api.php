<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

Route::group(['prefix' => 'v1', 'middleware' => []], function () {
    \GGPHP\Users\RouteRegistrar::routes(function ($router) {
        $router->forGuest();
    });

    Route::group(['middleware' => 'auth:api'], function () {
        \GGPHP\Users\RouteRegistrar::routes(function ($router) {
            $router->forBread();
        });
        \GGPHP\Category\RouteRegistrar::routes(function ($router) {
            $router->forBread();
        });
    });
});
