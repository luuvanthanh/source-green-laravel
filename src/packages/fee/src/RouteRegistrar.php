<?php

namespace GGPHP\Fee;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Fee\Http\Controllers';

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
            //class-types
            \Route::resource('class-types', 'ClassTypeController');
            //fees
            \Route::resource('fees', 'FeeController');
            //payment-forms
            \Route::resource('payment-forms', 'PaymentFormController');
            //student-objects
            \Route::resource('student-objects', 'StudentObjectController');
            //school-years
            \Route::resource('school-years', 'SchoolYearController');
            //fee-policie
            \Route::resource('fee-policies', 'FeePolicieController');

        });
    }
}
