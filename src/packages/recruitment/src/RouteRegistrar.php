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
        $this->forGuest();
    }

    public function forGuest()
    {
        $this->router->group(['middleware' => []], function ($router) {
            // get form tuyen dung
            \Route::get('get-form-recruitment', 'RecruitmentManagerController@getFormRecruitment');
            // Thêm ứng viên
            \Route::post('create-candidate', 'RecruitmentManagerController@createCandidate');
            \Route::resource('recruitment-candidate', 'RecruitmentCandidateManagementController')->only('store');
            // get lời cảm ơn.
            \Route::get('configure-thanks', 'RecruitmentConfigurationController@getConfigureThanks');
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
                // Quản lý cấp bậc
                \Route::resource('recruitment-levels', 'RecruitmentLevelController');
                // Cấu hình config
                \Route::resource('recruitment-configurations', 'RecruitmentConfigurationController');
                // Cấu hình lời cảm ơn
                \Route::post('configure-thanks', 'RecruitmentConfigurationController@storeConfigureThanks');
                // Quản lý tuyển dụng
                \Route::resource('recruitment-manager', 'RecruitmentManagerController');
                // get link tuyen dung
                \Route::get('get-link-recruitment', 'RecruitmentManagerController@getLink');
                // quản lý ứng viên 
                \Route::resource('recruitment-candidate', 'RecruitmentCandidateManagementController')->except('store');
                
            });
        });
    }
}
