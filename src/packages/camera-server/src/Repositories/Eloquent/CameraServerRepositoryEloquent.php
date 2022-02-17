<?php

namespace GGPHP\CameraServer\Repositories\Eloquent;

use GGPHP\Camera\Models\Camera;
use GGPHP\CameraServer\Models\CameraServer;
use GGPHP\CameraServer\Presenters\CameraServerPresenter;
use GGPHP\CameraServer\Repositories\Contracts\CameraServerRepository;
use GGPHP\CameraServer\Services\VmsCoreServices;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;
use Symfony\Component\HttpKernel\Exception\HttpException;

use function GuzzleHttp\json_decode;

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

    public function create(array $attributes)
    {
        \DB::beginTransaction();

        try {
            $cameraServer = CameraServer::create($attributes);

            $dataActive = [
                'server_id' => $cameraServer->uuid,
                'cam_data_as_bytes' => json_encode([
                    'input' => [
                        'cameras' => []
                    ],
                    'output' => [
                        'backup_video' => [
                            'root_path' => $cameraServer->root_path_bk,
                            'second_interval' => $cameraServer->second_interval_bk
                        ],
                        'media_server_url' => $cameraServer->media_server_url,
                        'clip_root_path' => $cameraServer->clip_root_path,
                        'log_root_path' => $cameraServer->log_root_path,
                        'log_level' => $cameraServer->log_level
                    ],
                    'delete_old_file' => [
                        'backup_video_day_passed' => $cameraServer->backup_video_day_passed,
                        'clip_video_day_passed' => $cameraServer->clip_video_day_passed,
                        'loggings_day_passed' => $cameraServer->loggings_day_passed,
                    ]
                ]),
            ];

            VmsCoreServices::activatedVmsCore($dataActive);
            \DB::commit();
            return parent::parserResult($cameraServer);
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }
    }

    public function changeStatus(array $attributes, $id)
    {
        $cameraServer = CameraServer::findOrFail($id);

        $cameraServer->update([
            'status' => $attributes['status']
        ]);

        return parent::parserResult($cameraServer);
    }

    public function activeVmsCore($id)
    {
        \DB::beginTransaction();

        try {
            $cameraServer = CameraServer::findOrFail($id);

            $dataActive = [
                'server_id' => $cameraServer->uuid,
                'cam_data_as_bytes' => json_encode([
                    'input' => [
                        'cameras' => []
                    ],
                    'output' => [
                        'backup_video' => [
                            'root_path' => $cameraServer->root_path_bk,
                            'second_interval' => (int) $cameraServer->second_interval_bk
                        ],
                        'media_server_url' => $cameraServer->media_server_url,
                        'clip_root_path' => $cameraServer->clip_root_path,
                        'log_root_path' => $cameraServer->log_root_path,
                        'log_level' => (int) $cameraServer->log_level
                    ],
                    'delete_old_file' => [
                        'backup_video_day_passed' => (int) $cameraServer->backup_video_day_passed,
                        'clip_video_day_passed' => (int) $cameraServer->clip_video_day_passed,
                        'loggings_day_passed' => (int) $cameraServer->loggings_day_passed,
                    ]
                ])
            ];

            VmsCoreServices::activatedVmsCore($dataActive);
            \DB::commit();

            return parent::parserResult($cameraServer);
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }
    }

    public function deactivationVmsCore($id)
    {
        \DB::beginTransaction();

        try {
            $cameraServer = CameraServer::findOrFail($id);

            $dataDeactive = [
                'server_id' => $cameraServer->uuid
            ];

            VmsCoreServices::deactivationVmsCore($dataDeactive);


            return parent::parserResult($cameraServer);
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }
    }
}
