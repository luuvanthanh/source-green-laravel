<?php

namespace GGPHP\Crm\AdmissionRegister;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Crm\AdmissionRegister\Http\Controllers';

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
            \Route::resource('admission-registers', 'AdmissionRegisterController');
            \Route::resource('parent-infos', 'ParentInfoController');
            \Route::resource('confirm-transporters', 'ConfirmTransporterController');
            \Route::resource('test-inputs', 'TestInputController');
        });
    }
}
