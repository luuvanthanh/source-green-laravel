<?php

namespace GGPHP\InOutHistories\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\InOutHistories\Models\InOutHistories;
use GGPHP\InOutHistories\Presenters\InOutHistoriesPresenter;
use GGPHP\InOutHistories\Repositories\Contracts\InOutHistoriesRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class InOutHistoriesRepositoryEloquent extends CoreRepositoryEloquent implements InOutHistoriesRepository
{
    protected $fieldSearchable = [
        'Id',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return InOutHistories::class;
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
        return InOutHistoriesPresenter::class;
    }

    public function filterInOutHistories(array $attributes)
    {

        if (!empty($attributes['startDate']) && !empty($attributes['startDate'])) {
            $this->model = $this->model->where('AttendedAt', '>=', $attributes['startDate'])->where('AttendedAt', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['studentId'])) {
            $studentId = explode(',', $attributes['studentId']);
            $this->model = $this->model->whereIn('StudentId', $studentId);
        }

        if (!empty($attributes['limit'])) {
            $inOutHistories = $this->paginate($attributes['limit']);
        } else {
            $inOutHistories = $this->get();
        }

        return $inOutHistories;
    }

}
