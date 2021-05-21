<?php

namespace GGPHP\Reward;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Reward\Http\Controllers';

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
            //rewards
            \Route::get('rewards', [
                'uses' => 'RewardController@index',
                'as' => 'reward.index',
            ]);

            \Route::get('employee/reward', [
                'uses' => 'RewardController@employeeReward',
                'as' => 'reward.employeeReward',
            ]);

            \Route::post('rewards', [
                'uses' => 'RewardController@store',
                'as' => 'reward.store',
            ]);

            \Route::get('rewards/{id}', [
                'uses' => 'RewardController@show',
                'as' => 'reward.show',
            ]);

            //decision-rewards
            \Route::get('decision-rewards', [
                'uses' => 'DecisionRewardController@index',
                'as' => 'decision-reward.index',
            ]);

            \Route::post('decision-rewards', [
                'uses' => 'DecisionRewardController@store',
                'as' => 'decision-reward.store',
            ]);

            \Route::get('decision-rewards/{id}', [
                'uses' => 'DecisionRewardController@show',
                'as' => 'decision-reward.show',
            ]);

            \Route::put('decision-rewards/{id}', [
                'uses' => 'DecisionRewardController@update',
                'as' => 'decision-reward.update',
            ]);

            \Route::delete('decision-rewards/{id}', [
                'uses' => 'DecisionRewardController@destroy',
                'as' => 'decision-reward.update',
            ]);

            \Route::get('decision-rewards-export-word/{id}', [
                'uses' => 'DecisionRewardController@exportWord',
                'as' => 'decision-rewards.word.export',
            ]);
        });
    }
}
