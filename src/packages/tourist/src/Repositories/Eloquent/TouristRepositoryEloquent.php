<?php

namespace GGPHP\Tourist\Repositories\Eloquent;

use GGPHP\Camera\Models\Camera;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\Tourist\Models\Tourist;
use GGPHP\Tourist\Presenters\TouristPresenter;
use GGPHP\Tourist\Repositories\Contracts\TouristRepository;
use Illuminate\Support\Facades\Http;
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
    public function getTourists(array $attributes, $parse = true)
    {
        if (!empty($attributes['image_url'])) {
            $imageUrl = [];

            foreach (explode(',', $attributes['image_url']) as $value) {
                $imageUrl[] = env('IMAGE_URL') . '/' . $value;
            }
            $response = Http::get(env('AI_URL') . '/tourist_search_url', [
                'image_url' => implode(',', $imageUrl),
            ]);

            $attributes['object_id'] = null;
            if ($response->successful()) {
                $attributes['object_id'] = json_decode($response->body())->uuid_lis;
            }

            if (is_null($attributes['object_id']) || empty($attributes['object_id'])) {
                $this->model = $this->model->where('object_id', null);
            } else {
                $this->model = $this->model->whereIn('object_id', $attributes['object_id']);
            }
        }


        if (!empty($attributes['tourist_destination_id'])) {
            $touristDestinationId = explode(',', $attributes['tourist_destination_id']);
            $this->model = $this->model->whereIn('tourist_destination_id', $touristDestinationId);
        }

        if (!empty($attributes['start_time']) && !empty($attributes['end_time'])) {
            $this->model = $this->model->where('time', '>=', $attributes['start_time'])->where('time', '<=', $attributes['end_time']);
        }

        if (!$parse) {
            return $this->model->get();
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

    public function exportExcelTourists($attributes)
    {
        $tourists = $this->getTourists($attributes, false);

        $params = [];

        $key = 0;
        foreach ($tourists as $key => $tourist) {
            $params['[number]'][] = ++$key;
            $params['[tourist_destination]'][] = $tourist->touristDestination->name;
            $params['[time]'][] = $tourist->time->format('d-m-Y H:i:s');
            $params['[camera]'][] = $$tourist->camera->name;
        }

        return  resolve(ExcelExporterServices::class)->export('tourist', $params);
    }
}
