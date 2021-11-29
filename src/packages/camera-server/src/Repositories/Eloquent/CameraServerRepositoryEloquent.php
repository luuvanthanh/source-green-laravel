<?php

namespace GGPHP\CameraServer\Repositories\Eloquent;

use GGPHP\Camera\Models\Camera;
use GGPHP\CameraServer\Models\CameraServer;
use GGPHP\CameraServer\Presenters\CameraServerPresenter;
use GGPHP\CameraServer\Repositories\Contracts\CameraServerRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class CameraServerRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CameraServerRepositoryEloquent extends BaseRepository implements CameraServerRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'id',
        'uuid' => 'like',
        'ipv4' => 'like',
        'ipv6' => 'like',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return CameraServer::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return CameraServerPresenter::class;
    }

    /**
     * Get collection
     *
     * @param type $items
     * @param type $collectionId
     * @return type
     */
    public function getCameraServers(array $attributes)
    {
        if (!empty($attributes['status'])) {
            $this->model = $this->model->whereIn('status', $attributes['status']);
        }

        if (!empty($attributes['id_server'])) {
            $this->model = $this->model->whereLike('id', $attributes['id_server']);
        }

        if (empty($attributes['limit'])) {
            $result = $this->all();
        } else {
            $result = $this->paginate($attributes['limit']);
        }

        return $result;
    }

    public function transferCamera(array $attributes, $id)
    {
        $cameraServer = CameraServer::findOrFail($id);

        $cameras = $cameraServer->camera;

        if (count($cameras) > 0) {
            $cameras->update([
                'camera_server_id' => $attributes['camera_server_to']
            ]);
        }

        return parent::parserResult($cameraServer);
    }

    public function changeStatus(array $attributes, $id)
    {
        $cameraServer = CameraServer::findOrFail($id);

        $cameraServer->update([
            'status' => $attributes['status']
        ]);

        return parent::parserResult($cameraServer);
    }
}
