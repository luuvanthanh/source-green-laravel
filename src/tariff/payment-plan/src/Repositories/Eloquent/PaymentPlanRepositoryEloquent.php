<?php

namespace GGPHP\Tariff\PaymentPlan\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Tariff\PaymentPlan\Models\PaymentPlan;
use GGPHP\Tariff\PaymentPlan\Models\PaymentPlanDetail;
use GGPHP\Tariff\PaymentPlan\Presenters\PaymentPlanPresenter;
use GGPHP\Tariff\PaymentPlan\Repositories\Contracts\PaymentPlanRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class ProfileInformationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class PaymentPlanRepositoryEloquent extends CoreRepositoryEloquent implements PaymentPlanRepository
{
    protected $fieldSearchable = [
        'Id', 'CreationTime'
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return PaymentPlan::class;
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
        return PaymentPlanPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['schoolYearId'])) {
            $schoolYearId = explode(' ', $attributes['schoolYearId']);
            $this->model = $this->model->whereIn('SchoolYearId', $schoolYearId);
        }

        if (!empty($attributes['chargeMonth'])) {
            $this->model = $this->model->whereDate('ChargeMonth', $attributes['chargeMonth']);
        }

        if (!empty($attributes['classId'])) {
            $classId = explode(' ', $attributes['classId']);
            $this->model = $this->model->whereIn('ClassId', $classId);
        }

        if (!empty($attributes['limit'])) {
            $paymentPlan = $this->paginate($attributes['limit']);
        } else {
            $paymentPlan = $this->get();
        }

        return $paymentPlan;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $paymentPlan = PaymentPlan::create($attributes);

            if (!empty($attributes['detail'])) {
                foreach ($attributes['detail'] as $value) {
                    $value['PaymentPlanId'] = $paymentPlan->Id;
                    PaymentPlanDetail::create($value);
                }
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($paymentPlan);
    }

    public function update(array $attributes, $id)
    {
        \DB::beginTransaction();
        try {
            $paymentPlan = PaymentPlan::find($id);
            $paymentPlan->update($attributes);

            if (!empty($attributes['detail'])) {
                $paymentPlan->paymentPlanDetail()->delete();

                foreach ($attributes['detail'] as $value) {
                    $value['PaymentPlanId'] = $paymentPlan->Id;
                    PaymentPlanDetail::create($value);
                }
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($paymentPlan);
    }
}
