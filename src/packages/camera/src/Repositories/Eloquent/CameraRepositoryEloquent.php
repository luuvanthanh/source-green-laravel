<?php

namespace GGPHP\Camera\Repositories\Eloquent;

use Carbon\Carbon;
use DB;
use GGPHP\Camera\Models\Camera;
use GGPHP\Camera\Presenters\CameraPresenter;
use GGPHP\Camera\Repositories\Contracts\CameraCollectionRepository;
use GGPHP\Camera\Repositories\Contracts\CameraRepository;
use GGPHP\Camera\Services\VmsCoreServices;
use GGPHP\Notification\Services\NotificationService;
use Illuminate\Container\Container as Application;
use Illuminate\Support\Str;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class CameraRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CameraRepositoryEloquent extends BaseRepository implements CameraRepository
{

    protected $fieldSearchable = [
        'id',
        'address',
        'address_detail',
        'status',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Camera::class;
    }

    /**
     * Init
     *
     * @param CameraCollectionRepository $cameraCollectionRepository
     * @param Application $app
     */
    public function __construct(
        CameraCollectionRepository $cameraCollectionRepository,
        Application $app
    ) {
        parent::__construct($app);
        $this->cameraCollectionRepository = $cameraCollectionRepository;
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
        return CameraPresenter::class;
    }

    /**
     * Get lists of camera
     *
     * @param type $request
     * @return type
     */
    public function getCamera($attributes)
    {

        // Filter camera by collection
        if (!empty($attributes['collection'])) {
            $collectionId = explode(',', $attributes['collection']);
            $this->model = $this->model->whereHas('collection', function ($query) use ($collectionId) {
                return $query->whereIn('collection_id', $collectionId);
            });
        }

        if (!empty($attributes['except_collection_id'])) {
            $exceptCollectionId = explode(',', $attributes['except_collection_id']);
            $this->model = $this->model->whereHas('collection', function ($query) use ($exceptCollectionId) {
                return $query->whereIn('collection_id', '=', $exceptCollectionId);
            }, '=', 0);
        }

        // Filter camera by video wall
        if (!empty($attributes['video_wall_id'])) {
            $videoWallId = explode(',', $attributes['video_wall_id']);
            $this->model = $this->model->whereHas('videoWalls', function ($query) use ($videoWallId) {
                return $query->whereIn('video_wall_id', $videoWallId);
            });
        }

        if (!empty($attributes['except_video_wall_id'])) {
            $exceptVideoWallId = explode(',', $attributes['except_video_wall_id']);
            $this->model = $this->model->whereHas('videoWalls', function ($q) use ($exceptVideoWallId) {
                return $q->where('video_wall_id', '=', $exceptVideoWallId);
            }, '=', 0);
        }

        // Filter by camera device name/number
        if (!empty($attributes['key'])) {
            $this->model = $this->model->orWhereLike('address', $attributes['key'])
                ->orWhereLike('name', $attributes['key']);
        }

        // Filter by camera device name/number
        if (!empty($attributes['name'])) {
            $this->model = $this->model->whereLike('name', $attributes['name']);
        };

        if (!empty($attributes['status'])) {
            $this->model = $this->model->whereIn('status', $attributes['status']);
        }

        if (empty($attributes['limit'])) {
            $result = $this->all();
        } else {
            $result = $this->paginate($attributes['limit']);
        }

        return $result;
    }

    /**
     * Create camera
     *
     * @param type $data
     * @return type
     * @throws \Throwable
     */
    public function create($attributes)
    {
        DB::beginTransaction();
        try {
            $attributes['status'] = Camera::STATUS['STATUS_PENDING'];

            $camera = Camera::create($attributes);

            if (isset($data['collection_id']) && !empty($attributes['collection_id'])) {
                $camera->collection()->attach($attributes['collection_id']);
            }

            DB::commit();

            $dataResolution = $this->getResolutionValue($camera->resolution);

            $dataStartCamera = [
                'server_id' => $camera->cameraServer->uuid,
                'cam_info_as_bytes' => json_encode([
                    'on' => true,
                    'rtsp' => $camera->rtsp,
                    'cam_id' => $camera->id,
                    'name' => $camera->name,
                    'backup' => $camera->is_recording,
                    'streaming' => $camera->is_streaming,
                    'streaming_infor' => [
                        'codec_id' => 27,
                        'profile' => $camera->profile,
                        'width' => $dataResolution['width'],
                        'height' => $dataResolution['height'],
                        'fps' => $camera->fps,
                        'bit_rate' => $camera->bit_rate,
                        'gop' => $camera->gop,
                        'max_B_frame' => $camera->frame_rate,
                    ],
                ]),
            ];

            VmsCoreServices::startCamera($dataStartCamera);
        } catch (\Throwable $e) {
            DB::rollback();
            throw new HttpException(500, $e->getMessage());
        }

        return parent::parserResult($camera);
    }

    /**
     * Update camera
     *
     * @param type $data
     * @param type $id
     * @return type
     * @throws \Throwable
     */
    public function update($data, $id)
    {
        DB::beginTransaction();
        try {
            // Check camera exist before update
            $camera = Camera::findOrFail($id);

            $data['status'] = Camera::STATUS['STATUS_PENDING'];
            // Update camera information
            if (!empty($dataCamera)) {
                $camera->update($data);
            }

            if (!empty($data['collection_id'])) {
                $camera->collection()->detach();
                $camera->collection()->sync($data['collection_id']);
            }

            $dataResolution = $this->getResolutionValue($camera->resolution);

            $dataStartCamera = [
                'server_id' => $camera->cameraServer->uuid,
                'cam_info_as_bytes' => json_encode([
                    'on' => true,
                    'rtsp' => $camera->rtsp,
                    'cam_id' => $camera->id,
                    'name' => $camera->name,
                    'backup' => $camera->is_recording,
                    'streaming' => $camera->is_streaming,
                    'streaming_infor' => [
                        'codec_id' => 27,
                        'profile' => $camera->profile,
                        'width' => $dataResolution['width'],
                        'height' => $dataResolution['height'],
                        'fps' => $camera->fps,
                        'bit_rate' => $camera->bit_rate,
                        'gop' => $camera->gop,
                        'max_B_frame' => $camera->frame_rate,
                    ],
                ]),
            ];

            VmsCoreServices::updateCamera($dataStartCamera);

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollback();
            throw new HttpException(500, $e->getMessage());
        }

        return parent::find($id);
    }

    /**
     * Delete camera
     *
     * @param type $id
     * @return type
     */
    public function delete($id)
    {
        $camera = Camera::findOrFail($id);

        \DB::beginTransaction();
        try {

            if (!empty($camera->collection)) {
                $camera->collection()->detach();
            }

            $dataDeleteCamera = [
                'server_id' => $camera->cameraServer->uuid,
                'cam_id' =>  $camera->id,
            ];

            VmsCoreServices::stopCamera($dataDeleteCamera);

            $camera->delete();

            \DB::commit();
        } catch (\Exception $ex) {
            \DB::rollback();
            throw new HttpException(500, $ex->getMessage());
        }

        return true;
    }

    public function getResolutionValue($value)
    {
        $width = 0;
        $height = 0;

        // switch ($value) {
        //     case 'FULLHD':
        //         $width = 1920;
        //         $height = 1080;
        //         break;
        //     case 'HD':
        //         $width = 1280;
        //         $height = 720;
        //         break;
        //     case '2K':
        //         $width = 2560;
        //         $height = 1440;
        //         break;
        // }

        return [
            'width' => $width,
            'height' => $height
        ];
    }

    public function onOffRecord($attributes, $id)
    {
        DB::beginTransaction();
        try {
            // Check camera exist before update
            $camera = Camera::findOrFail($id);


            $camera->update([
                'is_recording' => $attributes['is_recording']
            ]);

            $dataOnOffRecord = [
                'server_id' => $camera->cameraServer->uuid,
                'cam_id' => $camera->id,
                'on_flag' => $attributes['is_recording']
            ];

            VmsCoreServices::onOffRecord($dataOnOffRecord);

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollback();
            throw new HttpException(500, $e->getMessage());
        }

        return parent::find($id);
    }

    public function onOffStream($attributes, $id)
    {
        DB::beginTransaction();
        try {
            // Check camera exist before update
            $camera = Camera::findOrFail($id);


            $camera->update([
                'is_streaming' => $attributes['is_streaming']
            ]);

            $dataOnOffStream = [
                'server_id' => $camera->cameraServer->uuid,
                'cam_id' => $camera->id,
                'on_flag' => $attributes['is_streaming']
            ];

            VmsCoreServices::onOffStream($dataOnOffStream);

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollback();
            throw new HttpException(500, $e->getMessage());
        }

        return parent::find($id);
    }

    public function playback($attributes, $id)
    {
        // Check camera exist before update
        $camera = Camera::findOrFail($id);


        $dataBackup = [
            'server_id' => $camera->cameraServer->uuid,
            'cam_id' => $camera->id,
            'begin_datetime' => Carbon::parse($attributes['start_time'])->format('d-m-Y h:m:s'),
            'end_datetime' => Carbon::parse($attributes['end_time'])->format('d-m-Y h:m:s'),
        ];

        $result = VmsCoreServices::backupVideo($dataBackup);

        return parent::find($id);
    }

    public function cameraChangeLog($attributes)
    {
        $camera = Camera::findOrFail($attributes['came_id']);
        $attributes['cam_info'] = json_decode($attributes['cam_info'], true);

        $statusNow = $camera->status;
        switch ($attributes['status']) {
            case 'remove':
                $attributes['status'] =  Camera::STATUS['STATUS_FAILED'];
                $camera->update([
                    'status' => $attributes['status'],
                    'cam_info' => $attributes['cam_info']
                ]);

                break;
            case 'running':
                $attributes['status'] =  Camera::STATUS['STATUS_RUNNING'];

                $isLiveNow = false;
                $isStreamNow = false;
                $isBackupNow = false;

                $camInfo = $camera->cam_info;
                if (!is_null($camInfo)) {
                    $isLiveNow = $camInfo['capture_living'];
                    $isStreamNow = $camInfo['streaming_living'];
                    $isBackupNow = $camInfo['capture_living'];
                }

                $isLiveChange = $attributes['cam_info']['capture_living'];
                $isStreamChange = $attributes['cam_info']['streaming_living'];
                $isBackupChange = $attributes['cam_info']['capture_living'];

                $camera->update([
                    'status' => $attributes['status'],
                    'cam_info' => $attributes['cam_info']
                ]);

                if ($isLiveNow != $isLiveChange) {
                    NotificationService::updateCamera(NotificationService::CAMERA_UPDATE_LIVING, $camera);
                }

                if ($isStreamNow != $isStreamChange) {
                    NotificationService::updateCamera(NotificationService::CAMERA_UPDATE_STREAM, $camera);
                }

                if ($isBackupNow != $isBackupChange) {
                    NotificationService::updateCamera(NotificationService::CAMERA_UPDATE_RECORD, $camera);
                }

                break;
        }

        if ($statusNow != $attributes['status']) {
            NotificationService::updateCamera(NotificationService::CAMERA_UPDATE_STATUS, $camera);
        }

        return parent::find($attributes['came_id']);
    }
}
