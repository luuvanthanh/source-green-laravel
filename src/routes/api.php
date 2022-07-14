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

    Route::get('/debug-sentry', function () {
        throw new Exception('My first Sentry error!');
    });

    \GGPHP\Crm\WebForm\RouteRegistrar::routes(function ($router) {
        $router->forGuest();
    });

    \GGPHP\Crm\Facebook\RouteRegistrar::routes(function ($router) {
        $router->forGuest();
    });

    Route::group(['prefix' => 'sso', 'middleware' => []], function () {
        \GGPHP\Crm\CustomerLead\RouteRegistrar::routes(function ($router) {
            $router->forSso();
        });
    });

    Route::group(['middleware' => 'auth_sso'], function () {
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
            $router->forBread();
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

        \GGPHP\Crm\Employee\RouteRegistrar::routes(function ($router) {
            $router->forBread();
        });

        \GGPHP\Crm\AdmissionRegister\RouteRegistrar::routes(function ($router) {
            $router->forBread();
        });

        \GGPHP\Crm\Icon\RouteRegistrar::routes(function ($router) {
            $router->forBread();
        });

        \GGPHP\Crm\Config\RouteRegistrar::routes(function ($router) {
            $router->forBread();
        });

        \GGPHP\Crm\ChildDevelop\RouteRegistrar::routes(function ($router) {
            $router->forBread();
        });

        \GGPHP\Crm\SsoAccount\RouteRegistrar::routes(function ($router) {
            $router->forBread();
        });

        Route::group(['prefix' => 'clover', 'middleware' => []], function () {
            \GGPHP\Crm\Fee\RouteRegistrar::routes(function ($router) {
                $router->forClover();
            });
        });

        \GGPHP\Crm\Fee\RouteRegistrar::routes(function ($router) {
            $router->forBread();
        });
    });

    \GGPHP\Crm\Marketing\RouteRegistrar::routes(function ($router) {
        $router->forGuest();
    });

    \GGPHP\Crm\Category\RouteRegistrar::routes(function ($router) {
        $router->forGuest();
    });

    \GGPHP\Crm\Province\RouteRegistrar::routes(function ($router) {
        $router->forGuest();
    });

    \GGPHP\Crm\CallCenter\RouteRegistrar::routes(function ($route) {
        $route->forGuest();
    });

    \GGPHP\Crm\CustomerLead\RouteRegistrar::routes(function ($router) {
        $router->forGuest();
    });
});
