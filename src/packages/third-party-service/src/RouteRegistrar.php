<?php

namespace GGPHP\ThirdPartyService;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\ThirdPartyService\Http\Controllers';

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
        \Route::get('third-party-services', [
            'comment' => 'Danh sách cấu hình third party services',
            'uses' => 'ThirdPartyServiceController@index',
            'as' => 'VIEW_3RDSETTING',
            'group' => 'Cấu hình Third party services',
        ])->middleware('permission_for_role:VIEW_3RDSETTING');

        \Route::put('third-party-services/{id}', [
            'comment' => 'Hiệu chỉnh cấu hình',
            'uses' => 'ThirdPartyServiceController@update',
            'as' => 'EDIT_3RDSETTING',
            'group' => 'Cấu hình Third party services',
        ])->middleware('permission_for_role:EDIT_3RDSETTING');

        \Route::put('third-party-services/{id}', [
            'comment' => 'Hiệu chỉnh cấu hình',
            'uses' => 'ThirdPartyServiceController@show',
        ]);
    }
}
