<?php

namespace GGPHP\Profile;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Profile\Http\Controllers';

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
            //labours-contracts
            \Route::resource('labours-contracts', 'LabourContractController');

            //probationary_contract
            \Route::resource('probationary-contracts', 'ProbationaryContractController');

            //insurrances
            \Route::resource('insurrances', 'InsurranceController');

            //sabbatical-leaves
            \Route::resource('sabbatical-leaves', 'SabbaticalLeaveController');

            \Route::get('labours-contracts-export-word/{id}', [
                'uses' => 'LabourContractController@exportWord',
                'as' => 'labours-contracts.word.export',
            ]);
        });
    }
}
