<?php

namespace GGPHP\Fee;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;
use Illuminate\Support\Facades\Route;

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
        $this->forAccountant();
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
            Route::resource('class-types', 'ClassTypeController');
            //fees
            Route::resource('fees', 'FeeController');
            //payment-forms
            Route::resource('payment-forms', 'PaymentFormController');
            //student-objects
            Route::resource('student-objects', 'StudentObjectController');
            //school-years
            Route::resource('school-years', 'SchoolYearController');
            //fee-policie
            Route::resource('fee-policies', 'FeePolicieController');
            //charge-students
            Route::resource('charge-students', 'ChargeStudentController');
            //tuitions
            Route::resource('tuitions', 'TuitionController');
            //potential-students
            Route::resource('potential-students', 'PotentialStudentController');

            Route::get('money-fee-policies', 'FeePolicieController@moneyFeePolicies');

            Route::get('change-parameter-details', 'ChangeParameterDetailController@index');

            //charge-old-students
            Route::resource('charge-old-students', 'ChargeOldStudentController');

            //update school-year from crm
            Route::post('school-year-crm', 'SchoolYearController@schoolYearCrm');

            //update class-type from crm
            Route::post('class-type-crm', 'ClassTypeController@classTypeCrm');

            //update fee from crm
            Route::post('fee-crm', 'FeeController@feeCrm');
        });
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forAccountant()
    {
        $this->router->group(['middleware' => []], function ($router) {
            //charge-old-students
            Route::get('charge-old-students', 'ChargeOldStudentController@chargeOldStudent')->name('accountant.charge-old-students');
        });
    }
}
