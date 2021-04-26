<?php

namespace GGPHP\Profile\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Profile\Models\Insurrance;
use GGPHP\Profile\Presenters\InsurrancePresenter;
use GGPHP\Profile\Repositories\Contracts\InsurranceRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InsurranceRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class InsurranceRepositoryEloquent extends CoreRepositoryEloquent implements InsurranceRepository
{
    protected $excelExporterServices;

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'id',
        'employeeId',
        'insurrance_number' => 'like',
        'user.full_name' => 'like',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Insurrance::class;
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
        return InsurrancePresenter::class;
    }

    public function getInsurrance(array $attributes)
    {
        $this->model = $this->model->whereHas('employee', function ($query) use ($attributes) {
            $query->tranferHistory($attributes);
        });

        if (!empty($attributes['startTimeJoin']) && !empty($attributes['endTimeJoin'])) {
            $this->model = $this->model->where('TimeJoin', '>=', $attributes['startTimeJoin'])->where('TimeJoin', '<=', $attributes['endTimeJoin']);
        }

        if (!empty($attributes['limit'])) {
            $insurrance = $this->paginate($attributes['limit']);
        } else {
            $insurrance = $this->get();
        }

        return $insurrance;
    }
}
