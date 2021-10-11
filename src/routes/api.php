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

    //facebook
    \GGPHP\Crm\Facebook\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });
    //zalo
    \GGPHP\Crm\Zalo\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\Crm\Category\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\Crm\Province\RouteRegistrar::routes(function ($router) {
        $router->forGuest();
    });

    \GGPHP\Crm\CustomerLead\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\Crm\Marketing\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\Crm\CustomerPotential\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });
});
