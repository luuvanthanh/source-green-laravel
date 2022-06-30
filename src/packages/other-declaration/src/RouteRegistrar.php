<?php

namespace GGPHP\OtherDeclaration;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\OtherDeclaration\Http\Controllers';

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
            //other-declarations
            \Route::get('other-declarations', [
                'uses' => 'OtherDeclarationController@index',
                'as' => 'other-declarations.index',
            ]);

            \Route::post('other-declarations', [
                'uses' => 'OtherDeclarationController@store',
                'as' => 'other-declarations.store',
            ]);

            \Route::put('other-declarations/{id}', [
                'uses' => 'OtherDeclarationController@update',
                'as' => 'other-declarations.update',
            ]);

            \Route::get('other-declarations/{id}', [
                'uses' => 'OtherDeclarationController@show',
                'as' => 'other-declarations.show',
            ]);

            \Route::delete('other-declarations/{id}', [
                'uses' => 'OtherDeclarationController@destroy',
                'as' => 'other-declarations.destroy',
            ]);

            \Route::get('calculator-work', 'OtherDeclarationController@calculatorWork');
        });
    }
}
