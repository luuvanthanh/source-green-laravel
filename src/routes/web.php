<?php

use GGPHP\Users\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware(['cas.auth'])->group(function () {
    Route::get('/', function () {
        return view('welcome');
    });
});

Route::get('login/egov', [AuthController::class, 'egovLogin']);
Route::get('callback/egov', [AuthController::class, 'egovLoginCallback']);
