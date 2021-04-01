<?php

use Illuminate\Support\Facades\Route;

Route::group(['middleware' => []], function () {
    \ZK\RouteRegistrar::routes();
});
