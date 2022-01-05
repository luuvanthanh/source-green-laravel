<?php

namespace GGPHP\SystemConfig\Repositories\Eloquent;

use GGPHP\Camera\Models\Camera;
use GGPHP\SystemConfig\Models\SystemConfig;
use GGPHP\SystemConfig\Presenters\SystemConfigPresenter;
use GGPHP\SystemConfig\Repositories\Contracts\SystemConfigRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class SystemConfigRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class SystemConfigRepositoryEloquent extends BaseRepository implements SystemConfigRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at'
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return SystemConfig::class;
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
        return SystemConfigPresenter::class;
    }

    /**
     * Get video walls
     *
     * @param array $attributes
     */
    public function getSystemConfigs(array $attributes)
    {
        if (!empty($attributes['systemConfig_destination_id'])) {
            $systemConfigDestinationId = explode(',', $attributes['systemConfig_destination_id']);
            $this->model = $this->model->whereIn('systemConfig_destination_id', $systemConfigDestinationId);
        }

        if (!empty($attributes['start_time']) && !empty($attributes['end_time'])) {
            $this->model = $this->model->where('time', '>=', $attributes['start_time'])->where('time', '<=', $attributes['end_time']);
        }

        if (empty($attributes['limit'])) {
            $result = $this->all();
        } else {
            $result = $this->paginate($attributes['limit']);
        }

        return $result;
    }

    public function create(array $attributes)
    {
        if (!empty($attributes['event_code']) && $attributes['event_code'] == 'UPDATE_VIDEO') {
            $systemConfig = $this->model()::where('track_id', $attributes['track_id'])->first();
            if (!is_null($systemConfig) && !empty($attributes['video_path'])) {
                $systemConfig->addMediaFromDisk($attributes['video_path'])->preservingOriginal()->toMediaCollection('video');

                return parent::find($systemConfig->id);
            }

            return [];
        }

        $camera = Camera::find($attributes['camera_id']);
        $attributes['systemConfig_destination_id'] = $camera->systemConfig_destination_id;

        $systemConfig = null;

        if (!empty($attributes['track_id'])) {
            $systemConfig = $this->model()::where('track_id', $attributes['track_id'])->first();
        }

        if (is_null($systemConfig)) {
            $systemConfig = $this->model()::create($attributes);
        } else {
            $systemConfig->update($attributes);
        }

        if (!empty($attributes['image_path'])) {
            $systemConfig->addMediaFromDisk($attributes['image_path'])->preservingOriginal()->toMediaCollection('image');
        }

        if (!empty($attributes['video_path'])) {
            $systemConfig->addMediaFromDisk($attributes['video_path'])->preservingOriginal()->toMediaCollection('video');
        }

        return parent::find($systemConfig->id);
    }
}
