<?php

namespace GGPHP\Camera\Repositories\Eloquent;

use Carbon\Carbon;
use DB;
use GGPHP\AiService\Models\AiService;
use GGPHP\Camera\Jobs\VmsCoreJob;
use GGPHP\Camera\Models\Camera;
use GGPHP\Camera\Models\CameraService;
use GGPHP\Camera\Presenters\CameraPresenter;
use GGPHP\Camera\Repositories\Contracts\CameraCollectionRepository;
use GGPHP\Camera\Repositories\Contracts\CameraRepository;
use GGPHP\Camera\Services\AiApiServices;
use GGPHP\Camera\Services\VmsCoreServices;
use GGPHP\Notification\Services\NotificationService;
use Illuminate\Container\Container as Application;
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

        if (!empty($attributes['tourist_destination_id'])) {
            $touristDestinationId = explode(',', $attributes['tourist_destination_id']);
            $this->model = $this->model->whereIn('tourist_destination_id', $touristDestinationId);
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

        if (!empty($attributes['services_id'])) {
            $this->model = $this->model->whereHas('cameraService', function ($q) use ($attributes) {
                $q->whereIn('ai_service_id', explode(',', $attributes['services_id']))->where('is_on', true);
            });
        }

        if (request()->route()->getName() == 'cameras-share' || request()->route()->getName() == 'cameras-stream-share') {
            $this->model = $this->model->select(
                'id',
                'name',
                'address',
                'lat',
                'long',
                'gop',
                'status',
            );
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
                        'fps' => 0,
                        'bit_rate' => 0,
                        'gop' => 30,
                        'max_B_frame' => 0,
                    ],
                ]),
            ];
            dispatch(new VmsCoreJob($dataStartCamera, 'CREATE_CAMERA'));
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
            if (!empty($data)) {
                $camera->update($data);
            }

            if (!empty($data['collection_id'])) {
                $camera->collection()->detach();
                $camera->collection()->sync($data['collection_id']);
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
                        'width' => (int)$dataResolution['width'],
                        'height' => (int)$dataResolution['height'],
                        'fps' => 0,
                        'bit_rate' => 0,
                        'gop' => 30,
                        'max_B_frame' => 0,
                    ],
                ]),
            ];

            dispatch(new VmsCoreJob($dataStartCamera, 'UPDATE_CAMERA'));
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
            dispatch(new VmsCoreJob($dataDeleteCamera, 'DELETE_CAMERA'));

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
        $width = 854;
        $height = 480;

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
            'begin_datetime' => Carbon::parse($attributes['start_time'])->format('d-m-Y H:i:s'),
            'end_datetime' => Carbon::parse($attributes['end_time'])->format('d-m-Y H:i:s'),
        ];

        $result = VmsCoreServices::getPlayback($dataBackup);

        if ($result->stream_name) {
            $result->stream_url = env('MEDIA_URL')  . '/live' . '/' . $result->stream_name . '.flv';
        }

        return $result;
    }

    public function playbackStop($attributes, $id)
    {

        // Check camera exist before update
        $camera = Camera::findOrFail($id);

        $dataBackup = [
            'server_id' => $camera->cameraServer->uuid,
            'stream_name' => $attributes['stream_name']
        ];

        $result = VmsCoreServices::stopPlayback($dataBackup);

        return $result;
    }

    public function exportVideo($attributes, $id)
    {
        // Check camera exist before update
        $camera = Camera::findOrFail($id);

        $dataBackup = [
            'server_id' => $camera->cameraServer->uuid,
            'cam_id' => $camera->id,
            'begin_datetime' => Carbon::parse($attributes['start_time'])->format('d-m-Y H:i:s'),
            'end_datetime' => Carbon::parse($attributes['end_time'])->format('d-m-Y H:i:s'),
        ];

        $result = VmsCoreServices::exportVideo($dataBackup);

        return $result;
    }

    public function cameraChangeLog($attributes)
    {
        $camera = Camera::findOrFail($attributes['came_id']);

        $statusNow = $camera->status;
        switch ($attributes['status']) {
            case 'remove':
                $attributes['status'] =  Camera::STATUS['STATUS_FAILED'];
                $camera->update([
                    'status' => $attributes['status'],
                    'is_recording' => false,
                    'is_streaming' => false
                ]);

                break;
            case 'running':
                $attributes['cam_info'] = json_decode($attributes['cam_info'], true);

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
                $isBackupChange = $attributes['cam_info']['do_backup'];

                $attributes['status'] = $isLiveChange ? Camera::STATUS['STATUS_RUNNING'] : Camera::STATUS['STATUS_FAILED'];
                $camera->update([
                    'status' => $attributes['status'],
                    'cam_info' => $attributes['cam_info'],
                    'is_recording' => $attributes['cam_info']['do_backup'],
                    'is_streaming' => $attributes['cam_info']['streaming_living']
                ]);

                // if ($isLiveNow != $isLiveChange) {
                //     // NotificationService::updateCamera(NotificationService::CAMERA_UPDATE_LIVING, $camera);
                // }

                // if ($isStreamNow != $isStreamChange) {
                //     // NotificationService::updateCamera(NotificationService::CAMERA_UPDATE_STREAM, $camera);
                // }

                // if ($isBackupNow != $isBackupChange) {
                //     // NotificationService::updateCamera(NotificationService::CAMERA_UPDATE_RECORD, $camera);
                // }

                break;
        }

        if ($statusNow != $attributes['status']) {
            NotificationService::updateCamera(NotificationService::CAMERA_UPDATE_STATUS, $camera);
        }

        return parent::find($attributes['came_id']);
    }

    public function updateCameraAiService($attributes, $id)
    {
        $cameraService = CameraService::where('camera_id', $id)->where('ai_service_id', $attributes['ai_service_id'])->first();

        DB::beginTransaction();
        try {
            $cameraService->update([
                'is_on' => $attributes['is_on'],
                'coordinates' => $attributes['coordinates']
            ]);

            $service = AiService::find($attributes['ai_service_id']);

            $dataCameraService = [
                'camID' => $id,
                'no_service' => $service->number,
                'xy' => json_encode($attributes['coordinates']),
            ];

            // AiApiServices::updateCameraAiService($dataCameraService);

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($id);
    }

    public function onOffAiService($attributes, $id)
    {
        $cameraService = CameraService::where('camera_id', $id)->where('ai_service_id', $attributes['ai_service_id'])->first();

        DB::beginTransaction();
        try {
            if (is_null($cameraService)) {
                $cameraService = CameraService::create([
                    'camera_id' => $id,
                    'ai_service_id' => $attributes['ai_service_id'],
                    'is_on' => $attributes['is_on'],
                    'coordinates' => [
                        [
                            'x' => 0.02,
                            'y' => 0.02,
                            'index' => 0
                        ],
                        [
                            'x' => 0.02,
                            'y' => 0.02,
                            'index' => 1
                        ],
                        [
                            'x' => 0.02,
                            'y' => 0.02,
                            'index' => 2
                        ],
                        [
                            'x' => 0.02,
                            'y' => 0.02,
                            'index' => 3
                        ]
                    ]
                ]);
            } else {
                $cameraService->update([
                    'is_on' => $attributes['is_on']
                ]);
            }

            $service = AiService::find($attributes['ai_service_id']);

            $dataCameraService = [
                'camID' => $id,
                'no_service' => $service->number,
                'on_flag' => $attributes['is_on'],
            ];

            // AiApiServices::onOfServiceCamera($dataCameraService);

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($id);
    }

    public function cameraAiService($attributes, $id)
    {
        $cameraService = CameraService::where('camera_id', $id)->pluck('ai_service_id')->toArray();
        $aiServices = AiService::get();

        if (count($cameraService) == 0 || count($cameraService) < count($aiServices)) {

            foreach ($aiServices as $aiService) {
                if (in_array($aiService->id, $cameraService)) {
                    continue;
                }
                CameraService::create([
                    'ai_service_id' => $aiService->id,
                    'camera_id' => $id,
                    'coordinates' => [
                        [
                            'x' => 0.02,
                            'y' => 0.02,
                            'index' => 0
                        ],
                        [
                            'x' => 0.02,
                            'y' => 0.02,
                            'index' => 1
                        ],
                        [
                            'x' => 0.02,
                            'y' => 0.02,
                            'index' => 2
                        ],
                        [
                            'x' => 0.02,
                            'y' => 0.02,
                            'index' => 3
                        ]
                    ]
                ]);
            }
        }

        $cameraServiceRepositoryEloquent = resolve(CameraServiceRepositoryEloquent::class);

        return $cameraServiceRepositoryEloquent->parserResult(CameraService::where('camera_id', $id)->get());
    }

    /**
     * Delete camera
     *
     * @param type $id
     * @return type
     */
    public function disconnect($id)
    {
        $camera = Camera::findOrFail($id);

        $camera->update([
            'status' => Camera::STATUS['STATUS_FAILED']
        ]);
        $dataDeleteCamera = [
            'server_id' => $camera->cameraServer->uuid,
            'cam_id' =>  $camera->id,
        ];

        dispatch(new VmsCoreJob($dataDeleteCamera, 'DELETE_CAMERA'));

        return true;
    }
}
