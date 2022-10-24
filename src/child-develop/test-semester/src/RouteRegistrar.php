<?php

namespace GGPHP\ChildDevelop\TestSemester;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\ChildDevelop\TestSemester\Http\Controllers';

    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forBread();
        $this->forCrm();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forBread()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::resource('test-semesters', 'TestSemesterController');
            \Route::get('test-semester-students', 'TestSemesterController@testSemesterStudent');

            \Route::get('report-test-semesters', 'TestSemesterController@reportTestSemester');

            \Route::get('approved-test-semesters', 'TestSemesterController@approvedTestSemester');

            \Route::post('update-multiple', 'TestSemesterController@updateMultiple');

            \Route::get('update-score/{id}', 'TestSemesterController@updateScore');

            \Route::post('update-data-test-semesters', 'TestSemesterController@updateDataTestSemester');

            \Route::post('update-data-old-last-test-semesters', 'TestSemesterController@updateDataOldLastTestSemester');
        });
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forCrm()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::post('official-students', 'TestSemesterController@officialStudent');
        });
    }
}
