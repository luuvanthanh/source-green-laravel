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
    public function create($data)
    {
        // Merge with fills default
        $data = array_merge($data, [
            'status' => Camera::STATUS_STOPPED,
        ]);

        DB::beginTransaction();
        try {
            $camera = Camera::create($data);

            if (isset($data['collection_id']) && !empty($data['collection_id'])) {
                $camera->collection()->attach($data['collection_id']);
            }

            if (isset($data['video'])) {
                $videoProperties = array_merge($data['video'], [
                    'camera_id' => $camera->id
                ]);

                $this->cameraVideoPropertiesRepository->create($videoProperties);
            }

            DB::commit();
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

        // Merge with fills default
        $dataCamera = array_merge($data, [
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
                $camera->collection()->detach();
                $camera->collection()->sync($data['collection_id']);
            }

            if (isset($data['video'])) {
                if (!empty($camera->videoProperties->id)) {
                    $this->cameraVideoPropertiesRepository->update($data['video'], $camera->videoProperties->id);
                } else {
                    $this->cameraVideoPropertiesRepository->create(array_merge($data['video'], ['camera_id' => $camera->id]));
                }
            }

            $camera = Camera::with('videoProperties')->find($camera->id);
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

            if (!empty($camera->videoProperties->id)) {
                $camVideo = $this->cameraVideoPropertiesRepository->find($camera->videoProperties->id);
                if (!empty($camVideo)) {
                    $camVideo->delete();
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
