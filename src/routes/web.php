<?php

use GGPHP\Users\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('api/v1/login/egov', [AuthController::class, 'egovLogin']);
