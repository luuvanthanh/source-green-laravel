<?php

namespace GGPHP\Fee\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fee\Models\Tuition;
use GGPHP\Fee\Presenters\TuitionPresenter;
use GGPHP\Fee\Repositories\Contracts\TuitionRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class TuitionRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TuitionRepositoryEloquent extends CoreRepositoryEloquent implements TuitionRepository
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
        return Tuition::class;
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
        return TuitionPresenter::class;
    }

    public function filterTuition(array $attributes)
    {
        if (!empty($attributes['limit'])) {
            $paymentForm = $this->paginate($attributes['limit']);
        } else {
            $paymentForm = $this->get();
        }

        return $paymentForm;
    }

}
