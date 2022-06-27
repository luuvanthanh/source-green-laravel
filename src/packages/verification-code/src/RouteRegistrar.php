<?php

namespace GGPHP\VerificationCode;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\VerificationCode\Http\Controllers';

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
        \Route::get('verification_codes', [
            'uses' => 'VerificationCodeController@index',
        ]);

        \Route::post('verification_codes', [
            'uses' => 'VerificationCodeController@store',
        ]);
    }
}
