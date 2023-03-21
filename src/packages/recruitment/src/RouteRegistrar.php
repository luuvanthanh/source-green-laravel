<?php

namespace GGPHP\Recruitment;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Recruitment\Http\Controllers';

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
                // Quản lý cấp bậc
                \Route::resource('recruitment-levels', 'RecruitmentLevelController');
                // Cấu hình config
                \Route::resource('recruitment-configurations', 'RecruitmentConfigurationController');
                // Cấu hình lời cảm ơn
                \Route::get('configure-thanks', 'RecruitmentConfigurationController@getConfigureThanks');
                \Route::post('configure-thanks', 'RecruitmentConfigurationController@storeConfigureThanks');
                \Route::put('configure-thanks/{id}', 'RecruitmentConfigurationController@updateConfigureThanks');
                // Quản lý tuyển dụng
                \Route::resource('recruitment-manager', 'RecruitmentManagerController');
            });
        });
    }
}
