<?php

namespace GGPHP\Fee\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fee\Models\ChangeParameterDetail;
use GGPHP\Fee\Presenters\ChangeParameterDetailPresenter;
use GGPHP\Fee\Repositories\Contracts\ChangeParameterDetailRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ChangeParameterDetailRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ChangeParameterDetailRepositoryEloquent extends CoreRepositoryEloquent implements ChangeParameterDetailRepository
{
    protected $fieldSearchable = [
        'Id',
        'CreationTime',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ChangeParameterDetail::class;
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
        return ChangeParameterDetailPresenter::class;
    }

    public function filterChangeParameterDetail(array $attributes)
    {
        if (!empty($attributes['schoolYearId'])) {
            $this->model = $this->model->whereHas('changeParameter', function ($query) use ($attributes) {
                $query->where('SchoolYearId', $attributes['schoolYearId']);
            });
        }

        if (!empty($attributes['limit'])) {
            $changeParameterDetail = $this->paginate($attributes['limit']);
        } else {
            $changeParameterDetail = $this->get();
        }

        return $changeParameterDetail;
    }
}
