<?php

namespace GGPHP\Category;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Category\Http\Controllers';

    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forBread();
        $this->forGuest();
    }

    public function forGuest()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::resource('branches', 'BranchController')->only('index');
        });
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
                \Route::resource('training-schools', 'TrainingSchoolController');
                \Route::resource('training-majors', 'TrainingMajorController');
                \Route::resource('degrees', 'DegreeController');
                \Route::resource('educational-levels', 'EducationalLevelController');
                \Route::resource('paramater-values', 'ParamaterValueController');
                \Route::resource('paramater-value-logs', 'ParamaterValueLogController');
                \Route::resource('paramater-formulas', 'ParamaterFormulaController');
                \Route::resource('paramater-formula-logs', 'ParamaterFormulaLogController');
                \Route::resource('parameter-taxs', 'ParameterTaxController');
                \Route::resource('parameter-tax-logs', 'ParameterTaxLogController');
                \Route::resource('type-of-contracts', 'TypeOfContractController');
                \Route::resource('branches', 'BranchController')->except('index');
                \Route::resource('divisions', 'DivisionController');
                \Route::resource('positions', 'PositionController');
                \Route::resource('holidays', 'HolidayController');
                \Route::post('sync-branch', 'BranchController@syncBranch');
                \Route::get('report-refund', 'BranchController@reportRefund');
            });
        });
    }
}
