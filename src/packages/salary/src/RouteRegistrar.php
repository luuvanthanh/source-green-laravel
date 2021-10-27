<?php

namespace GGPHP\Salary;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Salary\Http\Controllers';

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
            //work-hours
            \Route::resource('payrolls', 'PayRollController');

            \Route::post('payslip', 'PayRollController@payslip');

            \Route::get('export-payrolls', 'PayRollController@exportPayroll');
        });
    }
}
