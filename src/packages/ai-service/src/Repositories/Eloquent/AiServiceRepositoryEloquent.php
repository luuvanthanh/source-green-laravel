<?php

namespace GGPHP\AiService\Repositories\Eloquent;

use GGPHP\Camera\Models\Camera;
use GGPHP\AiService\Models\AiService;
use GGPHP\AiService\Presenters\AiServicePresenter;
use GGPHP\AiService\Repositories\Contracts\AiServiceRepository;
use Illuminate\Support\Facades\Http;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class AiServiceRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AiServiceRepositoryEloquent extends BaseRepository implements AiServiceRepository
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
        return AiService::class;
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
        return AiServicePresenter::class;
    }

    /**
     * Get video walls
     *
     * @param array $attributes
     */
    public function getAiServices(array $attributes)
    {
        if (!empty($attributes['image_url'])) {
            $imageUrl = [];

            foreach (explode(',', $attributes['image_url']) as $value) {
                $imageUrl[] = env('IMAGE_URL') . '/' . $value;
            }
            $response = Http::get(env('AI_URL') . '/aiService_search_url', [
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


        if (!empty($attributes['aiService_destination_id'])) {
            $aiServiceDestinationId = explode(',', $attributes['aiService_destination_id']);
            $this->model = $this->model->whereIn('aiService_destination_id', $aiServiceDestinationId);
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
            $aiService = $this->model()::where('track_id', $attributes['track_id'])->first();
            if (!is_null($aiService) && !empty($attributes['video_path'])) {
                $aiService->addMediaFromDisk($attributes['video_path'])->preservingOriginal()->toMediaCollection('video');

                return parent::find($aiService->id);
            }

            return [];
        }

        $camera = Camera::find($attributes['camera_id']);
        $attributes['aiService_destination_id'] = $camera->aiService_destination_id;

        $aiService = null;

        if (!empty($attributes['track_id'])) {
            $aiService = $this->model()::where('track_id', $attributes['track_id'])->first();
        }

        if (is_null($aiService)) {
            $aiService = $this->model()::create($attributes);
        } else {
            $aiService->update($attributes);
        }

        if (!empty($attributes['image_path'])) {
            $aiService->addMediaFromDisk($attributes['image_path'])->preservingOriginal()->toMediaCollection('image');
        }

        if (!empty($attributes['video_path'])) {
            $aiService->addMediaFromDisk($attributes['video_path'])->preservingOriginal()->toMediaCollection('video');
        }

        return parent::find($aiService->id);
    }
}
