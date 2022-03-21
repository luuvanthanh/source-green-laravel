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

            \Route::get('probationary-contracts-export-word/{id}', [
                'uses' => 'ProbationaryContractController@exportWord',
                'as' => 'probationary-contracts.word.export',
            ]);

            \Route::get('labours-contracts-export-word-english/{id}', [
                'uses' => 'LabourContractController@exportWordEnglish',
                'as' => 'labours-contracts.word-english.export',
            ]);

            \Route::get('probationary-contracts-export-word-english/{id}', [
                'uses' => 'ProbationaryContractController@exportWordEnglish',
                'as' => 'probationary-contracts.word-english.export',
            ]);

            \Route::get('labours-contracts-export-word-authority/{id}', [
                'uses' => 'LabourContractController@exportWordAuthority',
                'as' => 'labours-contracts.word-authority.export',
            ]);

            \Route::get('probationary-contracts-export-word-authority/{id}', [
                'uses' => 'ProbationaryContractController@exportWordAuthority',
                'as' => 'probationary-contracts.word-authority.export',
            ]);

            \Route::resource('health-insurances', 'HealthInsuranceController');

            //seasonal-contracts
            \Route::resource('seasonal-contracts', 'SeasonalContractController');

            \Route::get('seasonal-contracts-export-word/{id}', [
                'uses' => 'SeasonalContractController@exportWord',
                'as' => 'seasonal-contracts.word.export',
            ]);

            \Route::get('seasonal-contracts-export-word-english/{id}', [
                'uses' => 'SeasonalContractController@exportWordEnglish',
                'as' => 'seasonal-contracts.word-english.export',
            ]);

            \Route::get('seasonal-contracts-export-word-authority/{id}', [
                'uses' => 'SeasonalContractController@exportWordAuthority',
                'as' => 'seasonal-contracts.word-authority.export',
            ]);

            \Route::get('report-working-seniority', [
                'uses' => 'LabourContractController@reportWorkingSeniority'
            ]);
        });
    }
}
