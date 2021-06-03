<?php

namespace GGPHP\InOutHistories\Repositories\Eloquent;

use GGPHP\Clover\Models\Student;
use GGPHP\Clover\Repositories\Eloquent\StudentRepositoryEloquent;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\InOutHistories\Models\InOutHistories;
use GGPHP\InOutHistories\Presenters\InOutHistoriesPresenter;
use GGPHP\InOutHistories\Repositories\Contracts\InOutHistoriesRepository;
use Illuminate\Container\Container as Application;
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

    public function __construct(
        StudentRepositoryEloquent $studentRepositoryEloquent,
        Application $app
    ) {
        parent::__construct($app);
        $this->studentRepositoryEloquent = $studentRepositoryEloquent;
    }

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

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('inOutHistory', function ($query) use ($attributes) {
                $query->where('AttendedAt', '>=', $attributes['startDate'])->where('AttendedAt', '<=', $attributes['endDate']);
            })->with(['inOutHistory' => function ($query) use ($attributes) {
                $query->where('AttendedAt', '>=', $attributes['startDate'])->where('AttendedAt', '<=', $attributes['endDate']);
            }]);
        }

        if (!empty($attributes['studentId'])) {
            $studentId = explode(',', $attributes['studentId']);
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereIn('Id', $studentId);
        }

        $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->where('Status', '!=', Student::STORE);

        if (!empty($attributes['limit'])) {
            $inOutHistories = $this->studentRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $inOutHistories = $this->studentRepositoryEloquent->get();
        }

        return $inOutHistories;
    }

}
