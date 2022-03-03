<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'welcome');

Route::get(
    '/dashboard',
    ['uses' => 'DashboardController@dashboard', 'as' => 'dashboard']
);

Route::view('cmc', 'cmc');
