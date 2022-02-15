<?php

namespace GGPHP\Fee\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fee\Models\PotentialStudent;
use GGPHP\Fee\Presenters\PotentialStudentPresenter;
use GGPHP\Fee\Repositories\Contracts\PotentialStudentRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class PotentialStudentRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class PotentialStudentRepositoryEloquent extends CoreRepositoryEloquent implements PotentialStudentRepository
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
        return PotentialStudent::class;
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
        return PotentialStudentPresenter::class;
    }

    public function filterPotentialStudent(array $attributes)
    {
        if (!empty($attributes['limit'])) {
            $paymentForm = $this->paginate($attributes['limit']);
        } else {
            $paymentForm = $this->get();
        }

        return $paymentForm;
    }
}
