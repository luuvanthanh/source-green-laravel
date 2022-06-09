<?php

namespace GGPHP\TrainingTeacher\TrainingSchedule;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\TrainingTeacher\TrainingSchedule\Http\Controllers';

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
            \Route::group(['middleware' => []], function () {
                \Route::resource('training-schedules', 'TrainingScheduleController');
            });

            \Route::put('update-training-modules/{id}', [
                'uses' => 'TrainingScheduleController@updateTrainingModule',
            ]);

            \Route::get('schedule-teachers',
                ['uses' => 'TrainingScheduleController@scheduleTeacher']
            );
        });
    }
}
