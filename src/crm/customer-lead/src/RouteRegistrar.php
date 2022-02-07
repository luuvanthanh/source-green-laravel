<?php

namespace GGPHP\Crm\CustomerLead;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Crm\CustomerLead\Http\Controllers';

    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forBread();
        $this->forSso();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forBread()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::resource('event-infos', 'EventInfoController');
            \Route::resource('customer-leads', 'CustomerLeadController');
            \Route::resource('references', 'ReferenceController');
            \Route::resource('customer-tags', 'CustomerTagController');
            \Route::resource('student-infos', 'StudentInfoController');
            \Route::post('employee-customer-leads', [
                'uses' => 'CustomerLeadController@storeEmployeeAssignment',
            ]);
            \Route::resource('status-cares', 'StatusCareController');
            \Route::post('merge-customer-leads', [
                'uses' => 'CustomerLeadController@mergeCustomerLead',
            ]);

            \Route::post('move-customer-potentials', [
                'uses' => 'CustomerLeadController@moveToCustomerPotential'
            ]);
            \Route::post('customer-lead-marketing-programs', 'CustomerLeadController@storeCareProgram');

            \Route::post('customer-lead-accounts', 'CustomerLeadController@customerLeadAccount');
        });
    }

    public function forSso()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::get('customer-lead-by-user-id/{id}', 'CustomerLeadController@getCustomerLead');
        });
    }
}
