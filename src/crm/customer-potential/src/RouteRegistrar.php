<?php

namespace GGPHP\Crm\CustomerPotential;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Crm\CustomerPotential\Http\Controllers';

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
            \Route::resource('customer-potentials', 'CustomerPotentialController');
            \Route::resource('potential-student-infos', 'PotentialStudentInfoController');
            \Route::resource('customer-potential-event-infos', 'CustomerPotentialEventInfoController');
            \Route::resource('customer-potential-status-cares', 'CustomerPotentialStatusCareController');
            \Route::resource('customer-potential-tags', 'CustomerPotentialTagController');
            \Route::resource('customer-potential-references', 'CustomerPotentialReferenceController');
        });
    }
}
