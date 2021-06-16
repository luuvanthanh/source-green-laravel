<?php

namespace GGPHP\Fee\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fee\Models\PaymentForm;
use GGPHP\Fee\Presenters\PaymentFormPresenter;
use GGPHP\Fee\Repositories\Contracts\PaymentFormRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class PaymentFormRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class PaymentFormRepositoryEloquent extends CoreRepositoryEloquent implements PaymentFormRepository
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
        return PaymentForm::class;
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
        return PaymentFormPresenter::class;
    }

    public function filterPaymentForm(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['type'])) {
            $this->model = $this->model->where('Type', $attributes['type']);
        }

        if (!empty($attributes['isSemester'])) {
            $this->model = $this->model->where('IsSemester', $attributes['isSemester']);
        }

        if (!empty($attributes['limit'])) {
            $paymentForm = $this->paginate($attributes['limit']);
        } else {
            $paymentForm = $this->get();
        }

        return $paymentForm;
    }

}
