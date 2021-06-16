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

    Route::group(['prefix' => 'ai', 'middleware' => []], function () {
        \GGPHP\Users\RouteRegistrar::routes(function ($router) {
            $router->forAi();
        });

        \GGPHP\Clover\RouteRegistrar::routes(function ($router) {
            $router->forAi();
        });
    });

    \GGPHP\Timekeeping\RouteRegistrar::routes(function ($router) {
        $router->forKiosk();
    });

    \GGPHP\FingerprintTimekeeper\RouteRegistrar::routes(function ($router) {
        $router->forKiosk();
    });

    \GGPHP\LateEarly\RouteRegistrar::routes(function ($router) {
        $router->forKiosk();
        $router->forCronJob();
    });

    \GGPHP\Fingerprint\RouteRegistrar::routes();
    \GGPHP\Timekeeping\RouteRegistrar::routes();
    \GGPHP\Absent\RouteRegistrar::routes();

    \GGPHP\Users\RouteRegistrar::routes(function ($router) {
        $router->forUser();
    });

    \GGPHP\ShiftSchedule\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\FingerprintTimekeeper\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\LateEarly\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\AddSubTime\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\Config\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\RevokeShift\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\WorkDeclaration\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\WorkHour\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\Category\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\Profile\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\Transfer\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\PositionLevel\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\Reward\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\Appoint\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\Dismissed\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\SalaryIncrease\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\ResignationDecision\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\DecisionSuspend\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\Clover\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\BusinessCard\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\MagneticCard\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\MaternityLeave\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    //YoungAttendance
    \GGPHP\InOutHistories\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\YoungAttendance\ShiftSchedule\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\YoungAttendance\Absent\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\OtherDeclaration\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\Children\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\Attendance\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    \GGPHP\BusRegistration\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });

    //fee
    \GGPHP\Fee\RouteRegistrar::routes(function ($router) {
        $router->forBread();
    });
});
