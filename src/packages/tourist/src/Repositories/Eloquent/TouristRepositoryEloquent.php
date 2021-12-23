<?php

namespace GGPHP\Tourist\Repositories\Eloquent;

use GGPHP\Camera\Models\Camera;
use GGPHP\Tourist\Models\Tourist;
use GGPHP\Tourist\Presenters\TouristPresenter;
use GGPHP\Tourist\Repositories\Contracts\TouristRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class TouristRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TouristRepositoryEloquent extends BaseRepository implements TouristRepository
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
        return Tourist::class;
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
        return TouristPresenter::class;
    }

    /**
     * Get video walls
     *
     * @param array $attributes
     */
    public function getTourists(array $attributes)
    {
        if (!empty($attributes['tourist_destination_id'])) {
            $touristDestinationId = explode(',', $attributes['tourist_destination_id']);
            $this->model = $this->model->whereIn('tourist_destination_id', $touristDestinationId);
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
            $tourist = $this->model()::where('track_id', $attributes['track_id'])->first();
            if (!is_null($tourist) && !empty($attributes['video_path'])) {
                $tourist->addMediaFromDisk($attributes['video_path'])->preservingOriginal()->toMediaCollection('video');

                return parent::find($tourist->id);
            }

            return [];
        }

        $camera = Camera::find($attributes['camera_id']);
        $attributes['tourist_destination_id'] = $camera->tourist_destination_id;

        $tourist = null;

        if (!empty($attributes['track_id'])) {
            $tourist = $this->model()::where('track_id', $attributes['track_id'])->first();
        }

        if (is_null($tourist)) {
            $tourist = $this->model()::create($attributes);
        } else {
            $tourist->update($attributes);
        }

        if (!empty($attributes['image_path'])) {
            $tourist->addMediaFromDisk($attributes['image_path'])->preservingOriginal()->toMediaCollection('image');
        }

        if (!empty($attributes['video_path'])) {
            $tourist->addMediaFromDisk($attributes['video_path'])->preservingOriginal()->toMediaCollection('video');
        }

        return parent::find($tourist->id);
    }
}
