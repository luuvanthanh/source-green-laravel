<?php

namespace GGPHP\Camera\Repositories\Eloquent;

use DB;
use GGPHP\Camera\Events\CameraAdded;
use GGPHP\Camera\Events\CameraDeleted;
use GGPHP\Camera\Events\CameraUpdated;
use GGPHP\Camera\Models\Camera;
use GGPHP\Camera\Models\CameraVideoProperties;
use GGPHP\Camera\Presenters\CameraPresenter;
use GGPHP\Camera\Repositories\Contracts\CameraCollectionRepository;
use GGPHP\Camera\Repositories\Contracts\CameraGeneralPropertiesRepository;
use GGPHP\Camera\Repositories\Contracts\CameraNetworkPropertiesRepository;
use GGPHP\Camera\Repositories\Contracts\CameraPtzPropertiesRepository;
use GGPHP\Camera\Repositories\Contracts\CameraRepository;
use GGPHP\Camera\Repositories\Contracts\CameraVideoPropertiesRepository;
use GGPHP\Camera\Transformers\SimpleCameraTransformer;
use Illuminate\Container\Container as Application;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use League\Fractal;
use League\Fractal\Manager;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

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
        'generalProperties.device_name'
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
     * @param CameraGeneralPropertiesRepository $cameraGeneralPropertiesRepository
     * @param CameraNetworkPropertiesRepository $cameraNetworkPropertiesRepository
     * @param CameraVideoPropertiesRepository $cameraVideoPropertiesRepository
     * @param CameraPtzPropertiesRepository $cameraPtzPropertiesRepository
     * @param Application $app
     */
    public function __construct(
        CameraCollectionRepository $cameraCollectionRepository,
        CameraGeneralPropertiesRepository $cameraGeneralPropertiesRepository,
        CameraNetworkPropertiesRepository $cameraNetworkPropertiesRepository,
        CameraVideoPropertiesRepository $cameraVideoPropertiesRepository,
        CameraPtzPropertiesRepository $cameraPtzPropertiesRepository,
        Application $app
    ) {
        $this->cameraCollectionRepository = $cameraCollectionRepository;
        $this->cameraGeneralPropertiesRepository = $cameraGeneralPropertiesRepository;
        $this->cameraNetworkPropertiesRepository = $cameraNetworkPropertiesRepository;
        $this->cameraVideoPropertiesRepository = $cameraVideoPropertiesRepository;
        $this->cameraPtzPropertiesRepository = $cameraPtzPropertiesRepository;
        parent::__construct($app);
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
            $this->model = $this->model->whereLike('address', $attributes['key'])
                ->orWhere(function ($query) use ($attributes) {
                    $query->whereHas('generalProperties', function ($q) use ($attributes) {
                        $q->orWhereLike('device_name', $attributes['key'])
                            ->orWhereLike('device_number', $attributes['key']);
                    });
                });
        }

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
    public function create($data)
    {
        // Get only fills define
        $dataCamera = Arr::only($data, Camera::$fillable_post);

        // Merge with fills default
        $dataCamera = array_merge($dataCamera, [
            'user_id' => auth()->user()->id,
            'uuid' => (string) Str::uuid(),
            'status' => Camera::STATUS_STOPPED,
        ]);

        DB::beginTransaction();
        try {
            // Create camera
            $camera = Camera::create($dataCamera);
            if (isset($data['collection_id']) && !empty($data['collection_id'])) {
                $cameraCollection = $camera->collection()->attach($data['collection_id']);
            }
            $data['general']['device_name'] = !empty($data['general']['device_name']) ? $data['general']['device_name'] : $this->autoGenCameraGeneralName($camera->id);
            $data['general']['device_number'] = !empty($data['general']['device_number']) ? $data['general']['device_number'] : $camera->id;
            // $data['General']['device_number'] = $this->autoGenCameraGeneralNumber();
            if (isset($data['general'])) {

                $cameraGeneral = $this->cameraGeneralPropertiesRepository->create(array_merge($data['general'], ['camera_id' => $camera->id]));
            }
            if (isset($data['video'])) {
                if (empty($data['video']['rtsp_url'])) {
                    $username = !empty($data['general']['user_name']) ? $data['general']['user_name'] : null;
                    $password = !empty($data['general']['password']) ? $data['general']['password'] : null;
                    $ip = !empty($data['general']['ip']) ? $data['general']['ip'] : null;
                    $port = !empty($data['general']['port']) ? $data['general']['port'] : null;
                    $data['video']['rtsp_url'] = self::generateVideoSource($username, $password, $ip, $port);
                }

                if (isset($data['video']['streaming_enabled']) && $data['video']['streaming_enabled'] == CameraVideoProperties::STREAMING_ENABLED) {
                    $data['video']['stream_url'] = self::generateStreamURL($camera);
                }

                $videoProperties = array_merge($data['video'], [
                    'camera_id' => $camera->id,
                    'recording_enabled' => !empty($data['video']['recording_enabled']) ? $data['video']['recording_enabled'] : CameraVideoProperties::RECORDING_DISABLED,
                    'streaming_enabled' => !empty($data['video']['streaming_enabled']) ? $data['video']['streaming_enabled'] : CameraVideoProperties::STREAMING_DISBALED,
                ]);

                $cameraVideo = $this->cameraVideoPropertiesRepository->create($videoProperties);
            }
            if (isset($data['network'])) {
                $cameraNetwork = $this->cameraNetworkPropertiesRepository->create(array_merge($data['network'], ['camera_id' => $camera->id]));
            }
            if (isset($data['ptz'])) {
                $cameraPtz = $this->cameraPtzPropertiesRepository->create(array_merge($data['ptz'], ['camera_id' => $camera->id]));
            }

            DB::commit();

            $camera = Camera::with('videoProperties')->find($camera->id);

            // Publish event added
            event(new CameraAdded($camera));
        } catch (\Throwable $e) {
            DB::rollback();
            throw $e;
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
        // Check camera exist before update
        $camera = Camera::findOrFail($id);

        // Get only fills define
        $dataCamera = Arr::only($data, Camera::$fillable_post);

        // Merge with fills default
        $dataCamera = array_merge($dataCamera, [
            'user_id' => auth()->user()->id,
            'uuid' => (string) Str::uuid(),
            'status' => Camera::STATUS_STOPPED,
        ]);


        try {
            // Update camera information
            if (!empty($dataCamera)) {
                $camera->update($dataCamera);
            }

            if (!empty($data['collection_id'])) {
                $cameraCollection = $camera->collection()->sync($data['collection_id']);
            } else {
                $cameraCollection = $camera->collection()->detach();
            }
            if (isset($data['general'])) {
                if (!empty($camera->generalProperties->id)) {
                    $cameraGeneral = $this->cameraGeneralPropertiesRepository->update($data['general'], $camera->generalProperties->id);
                } else {
                    $cameraGeneral = $this->cameraGeneralPropertiesRepository->create(array_merge($data['general'], ['camera_id' => $camera->id]));
                }
            }
            if (isset($data['video'])) {
                if (empty($data['video']['rtsp_url'])) {
                    $userName = !empty($data['general']['user_name']) ? $data['general']['user_name'] : (!empty($camera->generalProperties->user_name) ? $camera->generalProperties->user_name : null);
                    $password = !empty($data['general']['password']) ? $data['general']['password'] : (!empty($camera->generalProperties->password) ? $camera->generalProperties->password : null);
                    $ip = !empty($data['general']['ip']) ? $data['general']['ip'] : (!empty($camera->generalProperties->ip) ? $camera->generalProperties->ip : null);
                    $port = !empty($data['general']['port']) ? $data['general']['port'] : (!empty($camera->generalProperties->port) ? $camera->generalProperties->port : null);
                    $data['video']['rtsp_url'] = self::generateVideoSource($userName, $password, $ip, $port);
                }

                if (isset($data['video']['streaming_enabled']) && $data['video']['streaming_enabled'] == CameraVideoProperties::STREAMING_ENABLED) {
                    $data['video']['stream_url'] = self::generateStreamURL($camera);
                } else {
                    $data['video']['stream_url'] = "";
                }

                if (!empty($camera->videoProperties->id)) {
                    $cameraVideo = $this->cameraVideoPropertiesRepository->update($data['video'], $camera->videoProperties->id);
                } else {
                    $cameraVideo = $this->cameraVideoPropertiesRepository->create(array_merge($data['video'], ['camera_id' => $camera->id]));
                }

                // Update status camera
                if (
                    $cameraVideo->streaming_enabled === CameraVideoProperties::STREAMING_ENABLED ||
                    $cameraVideo->recording_enabled === CameraVideoProperties::RECORDING_ENABLED
                ) {
                    $camera->status = Camera::STATUS_STARTED;
                    $camera->save();
                }
            }

            if (isset($data['network'])) {
                if (!empty($camera->networkProperties->id)) {
                    $cameraNetwork = $this->cameraNetworkPropertiesRepository->update($data['network'], $camera->networkProperties->id);
                } else {
                    $cameraNetwork = $this->cameraNetworkPropertiesRepository->create(array_merge($data['network'], ['camera_id' => $camera->id]));
                }
            }

            if (isset($data['ptz'])) {
                if (!empty($camera->ptzProperties->id)) {
                    $cameraPtz = $this->cameraPtzPropertiesRepository->update($data['ptz'], $camera->ptzProperties->id);
                } else {
                    $cameraPtz = $this->cameraPtzPropertiesRepository->create(array_merge($data['ptz'], ['camera_id' => $camera->id]));
                }
            }

            $camera = Camera::with('videoProperties')->find($camera->id);

            // Publish event updated
            event(new CameraUpdated($camera));
        } catch (\Throwable $e) {
            throw $e;
        }

        return parent::parserResult($camera);
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
            if (!empty($camera->generalProperties->id)) {
                $camGeneral = $this->cameraGeneralPropertiesRepository->find($camera->generalProperties->id);
                if (!empty($camGeneral)) {
                    $camGeneral->delete();
                }
            }
            if (!empty($camera->videoProperties->id)) {
                $camVideo = $this->cameraVideoPropertiesRepository->find($camera->videoProperties->id);
                if (!empty($camVideo)) {
                    $camVideo->delete();
                }
            }
            if (!empty($camera->networkProperties->id)) {
                $camNetwork = $this->cameraNetworkPropertiesRepository->find($camera->networkProperties->id);
                \Log::debug($camNetwork);
                if (!empty($camNetwork)) {
                    $camNetwork->delete();
                }
            }
            if (!empty($camera->ptzProperties->id)) {
                $camPtz = $this->cameraPtzPropertiesRepository->find($camera->ptzProperties->id);
                if (!empty($camPtz)) {
                    $camPtz->delete();
                }
            }
            if (!empty($camera->collection)) {
                $camera->collection()->detach();
            }

            if (!empty($camera->videoWalls)) {
                $camera->videoWalls()->detach();
            }

            //TODO: remove camera from video wall....

            if ($camera->delete()) {
                // Publish event deleted
                event(new CameraDeleted($camera));
                \DB::commit();
                return true;
            }
        } catch (\Exception $ex) {
            \DB::rollback();
            \Log::error($ex->getMessage());
        }
        return false;
    }

    public function getSimpleListing()
    {
        $cameras = Camera::with('videoProperties')->get();
        $fractal = new Manager;
        $resource = new Fractal\Resource\Collection($cameras, new SimpleCameraTransformer);
        $data = $fractal->createData($resource)->toArray();

        return $data;
    }

    /**
     * Auto generate device name
     *
     * @param type $camera_id
     * @return type
     */
    public function autoGenCameraGeneralName($camera_id)
    {
        $prefix = env('CAMERA_PREFIX_NAME', 'Camera');
        return $prefix . ' ' . $camera_id;
    }

    /**
     * Auto generate device number
     *
     * @return type
     */
    public function autoGenCameraGeneralNumber()
    {
        $latest = Camera::latest()->first();
        return $latest->id ? (int) $latest->id : 1;
    }

    /**
     * Generate stream url when enabaled streaming status
     *
     * @param Camera $camera
     */
    public static function generateStreamURL(Camera $camera)
    {
        return sprintf('%s/live/%s.flv', env('PLAYBACK_SERVER', ''), $camera->uuid);
    }

    /**
     * Generate video source
     *
     * @param Camera $camera
     */
    public static function generateVideoSource($userName, $password, $ip, $port)
    {
        if (empty($userName) || empty($password)) {
            return sprintf('rtsp://%s:%s', $ip, $port);
        }

        return sprintf('rtsp://%s:%s@%s:%s', $userName, $password, $ip, $port);
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
}
