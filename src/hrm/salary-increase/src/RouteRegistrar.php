<?php

namespace GGPHP\SalaryIncrease;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\SalaryIncrease\Http\Controllers';

    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forBread();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forBread()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::group(['middleware' => []], function () {
                //salary-increases
                \Route::get('salary-increases', [
                    'uses' => 'SalaryIncreaseController@index',
                    'as' => 'salary-increases.index',
                ]);

                \Route::post('salary-increases', [
                    'uses' => 'SalaryIncreaseController@store',
                    'as' => 'salary-increases.store',
                ]);

                \Route::put('salary-increases/{id}', [
                    'uses' => 'SalaryIncreaseController@update',
                    'as' => 'salary-increases.update',
                ]);

                \Route::get('salary-increases/{id}', [
                    'uses' => 'SalaryIncreaseController@show',
                    'as' => 'salary-increases.show',
                ]);

                \Route::delete('salary-increases/{id}', [
                    'uses' => 'SalaryIncreaseController@destroy',
                    'as' => 'salary-increases.destroy',
                ]);

                \Route::get('salary-increases-export-word/{id}', [
                    'uses' => 'SalaryIncreaseController@exportWord',
                    'as' => 'salary-increases.word.export',
                ]);
            });

        });
    }
}
