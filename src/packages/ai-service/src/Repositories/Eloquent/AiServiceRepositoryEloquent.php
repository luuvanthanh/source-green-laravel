<?php

namespace GGPHP\AiService\Repositories\Eloquent;

use GGPHP\AiService\Models\AiService;
use GGPHP\AiService\Presenters\AiServicePresenter;
use GGPHP\AiService\Repositories\Contracts\AiServiceRepository;
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
}
