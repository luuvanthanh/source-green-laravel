<?php

namespace GGPHP\Crm\Fee\Repositories\Eloquent;

use GGPHP\Crm\Fee\Models\PaymentForm;
use GGPHP\Crm\Fee\Presenters\PaymentFormPresenter;
use GGPHP\Crm\Fee\Repositories\Contracts\PaymentFormRepository;
use GGPHP\Crm\Fee\Services\PaymentFormCloverService;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class SsoAccountRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class PaymentFormRepositoryEloquent extends BaseRepository implements PaymentFormRepository
{

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

    public function getPaymentForm(array $attributes)
    {
        if (!empty($attributes['limit'])) {
            $fee = $this->paginate($attributes['limit']);
        } else {
            $fee = $this->get();
        }

        return $fee;
    }

    public function getPaymentFormClover()
    {
        PaymentFormCloverService::result();
    }
}
