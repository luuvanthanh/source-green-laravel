<?php

namespace GGPHP\Fingerprint;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Fingerprint\Http\Controllers';

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
            $router->get('/fingerprints', [
                'uses' => 'FingerprintController@index',
                'as' => 'fingerprints.index',
                'comment' => 'Danh sách vân tay',
                'group' => 'Vân tay',
            ]);

            $router->patch('/fingerprints/{fingerpint}', [
                'uses' => 'FingerprintController@update',
                'as' => 'fingerprints.update',
                'comment' => 'Chỉnh sửa vân tay',
                'group' => 'Vân tay',
            ]);

            $router->delete('/fingerprints/{fingerpint}', [
                'uses' => 'FingerprintController@destroy',
                'as' => 'fingerprints.destroy',
                'comment' => 'Xóa vân tay',
                'group' => 'Vân tay',
            ]);
        });
    }
}
