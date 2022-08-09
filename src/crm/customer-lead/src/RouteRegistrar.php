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
        $this->forGuest();
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
            \Route::resource('customer-leads', 'CustomerLeadController')->except('index');
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
            \Route::resource('status-lead', 'StatusLeadController');

            \Route::get('customer-by-phone/{phone}', 'CustomerLeadController@customerByPhone');
            \Route::post('import-excel-customer-leads', 'CustomerLeadController@importExcelCustomerLead');
            \Route::get('template-excel-customer-leads', 'CustomerLeadController@templateExcelCustomerLead');
            \Route::resource('history-cares', 'HistoryCareController');

            \Route::post('import-excel-customer-lead-old', 'CustomerLeadController@importExcelCustomerLeadOld');
            \Route::get('template-excel-customer-lead-old', 'CustomerLeadController@templateExcelCustomerLeadOld');
        });
    }

    public function forSso()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::get('customer-lead-by-user-id/{id}', 'CustomerLeadController@getCustomerLead');
        });
    }

    public function forGuest()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::resource('customer-leads', 'CustomerLeadController')->only('index');
        });
    }
}
