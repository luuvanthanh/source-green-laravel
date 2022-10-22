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
    \GGPHP\SurveyForm\RouteRegistrar::routes(function ($router) {
        $router->forGuest();
    });

    \GGPHP\Storage\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\Event\RouteRegistrar::routes(function ($router) {
        $router->forGuest();
    });

    Route::group(['prefix' => 'ai'], function () {
        \GGPHP\TourGuide\RouteRegistrar::routes(function ($router) {
            $router->forAi();
        });
        \GGPHP\Event\RouteRegistrar::routes(function ($router) {
            $router->forAi();
        });
        \GGPHP\NumberOfTourist\RouteRegistrar::routes(function ($router) {
            $router->forAi();
        });
        \GGPHP\Tourist\RouteRegistrar::routes(function ($router) {
            $router->forAi();
        });
    });

    Route::group(['prefix' => 'vms-core'], function () {
        \GGPHP\Camera\RouteRegistrar::routes(function ($router) {
            $router->forVmsCore();
        });
    });

    Route::group(['prefix' => 'share'], function () {
        Route::group(['middleware' => ['check_is_share_api']], function () {
            \GGPHP\TourGuide\RouteRegistrar::routes(function ($router) {
                $router->forShare();
            });
            \GGPHP\Camera\RouteRegistrar::routes(function ($router) {
                $router->forShare();
            });
        });
    });

    Route::group(['middleware' => ['auth:api', 'check_view_permission']], function () {
        \GGPHP\Users\RouteRegistrar::routes(function ($router) {
            $router->forBread();
        });
        \GGPHP\Category\RouteRegistrar::routes(function ($router) {
            $router->forBread();
        });
        \GGPHP\TourGuide\RouteRegistrar::routes(function ($router) {
            $router->forBread();
        });
        \GGPHP\TravelAgency\RouteRegistrar::routes(function ($router) {
            $router->forBread();
        });
        \GGPHP\Event\RouteRegistrar::routes(function ($router) {
            $router->forBread();
        });

        \GGPHP\Camera\RouteRegistrar::routes(function ($router) {
            $router->forBread();
        });
        \GGPHP\NumberOfTourist\RouteRegistrar::routes(function ($router) {
            $router->forBread();
        });
        \GGPHP\SurveyForm\RouteRegistrar::routes(function ($router) {
            $router->forBread();
        });
        \GGPHP\Collection\RouteRegistrar::routes();
        \GGPHP\CameraServer\RouteRegistrar::routes();
        \GGPHP\VideoWall\RouteRegistrar::routes();
        \GGPHP\VideoWall\RouteRegistrar::routes();
        \GGPHP\RolePermission\RouteRegistrar::routes();
        \GGPHP\ActivityLog\RouteRegistrar::routes();
        \GGPHP\Report\RouteRegistrar::routes();
        \GGPHP\Tourist\RouteRegistrar::routes();
        \GGPHP\Notification\RouteRegistrar::routes();
        \GGPHP\EventConfig\RouteRegistrar::routes();
        \GGPHP\ThirdPartyService\RouteRegistrar::routes();
        \GGPHP\ApiShare\RouteRegistrar::routes();
        \GGPHP\NasConfig\RouteRegistrar::routes();
        \GGPHP\SystemConfig\RouteRegistrar::routes();
        \GGPHP\AiService\RouteRegistrar::routes();
        \GGPHP\VerificationCode\RouteRegistrar::routes();
    });
});
