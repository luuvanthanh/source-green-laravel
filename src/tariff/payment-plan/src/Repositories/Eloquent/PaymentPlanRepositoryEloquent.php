<?php

namespace GGPHP\Tariff\PaymentPlan\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Clover\Models\Student;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fee\Models\ChargeOldStudent;
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

        if (!empty($attributes['studentId'])) {
            $this->model = $this->model->whereHas('paymentPlanDetail', function ($query) use ($attributes) {
                $query->where('StudentId', $attributes['studentId']);
            });
        }

        if (!empty($attributes['status'])) {
            $this->model = $this->model->where('Status', $attributes['status']);
        }

        $this->model = $this->model->with(['paymentPlanDetail' => function ($query) use ($attributes) {
            if (!empty($attributes['studentId'])) {
                $query->where('StudentId', $attributes['studentId']);
            }
        }]);

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

    public function sentPaymentPlan($attributes)
    {
        $arrayStudentId = [];
        $paymentPlan = PaymentPlan::findOrFail($attributes['id']);
        $arrayPaymentPlanDetailId = $paymentPlan->paymentPlanDetail()->pluck('ChargeOldStudentId')->toArray();
        $arrayStudentId = $paymentPlan->paymentPlanDetail()->pluck('StudentId')->toArray();

        $students = Student::whereIn('Id', $arrayStudentId)->get();

        foreach ($students as $student) {
            $this->sentNotification($student, $paymentPlan, $arrayPaymentPlanDetailId);
        }

        $paymentPlan->update(['Status' => $attributes['status']]);

        return parent::parserResult($paymentPlan);
    }

    public function sentNotification($student, $paymentPlan, $arrayPaymentPlanDetailId)
    {
        $parent = $student->parent()->with('account')->get();

        if (!empty($parent)) {
            $arrId = array_column(array_column($parent->ToArray(), 'account'), 'AppUserId');

            $images =  json_decode($student->FileImage);
            $urlImage = '';

            if (!empty($images)) {
                $urlImage = env('IMAGE_URL') . $images[0];
            }

            $month = Carbon::parse($paymentPlan->ChargeMonth);
            $paymentPlanDetail =  $paymentPlan->paymentPlanDetail()->where('StudentId', $student->Id)->first();
            $totalMoneyMonth = !is_null($paymentPlanDetail->TotalMoneyMonth) ? number_format($paymentPlanDetail->TotalMoneyMonth) : 0;
            $message = 'Biểu phí tháng ' . $month->format('m/Y') . ' của bé ' . $student->FullName . ' là ' . $totalMoneyMonth;

            if (!empty($arrId)) {
                $dataNotifiCation = [
                    'users' => $arrId,
                    'title' => 'Biểu Phí',
                    'imageURL' => $urlImage,
                    'message' => $message,
                    'moduleType' => 30,
                    'refId' => $paymentPlan->Id . '/' . $student->Id,
                ];

                dispatch(new \GGPHP\Core\Jobs\SendNotiWithoutCode($dataNotifiCation));
            }
        }
    }

    public function findPaymentPlan($attributes, $id)
    {
        $paymentPlan = PaymentPlan::with(['paymentPlanDetail' => function ($query) use ($attributes) {
            if (!empty($attributes['studentId'])) {
                $query->where('StudentId', $attributes['studentId']);
            }
        }])->where('Id', $id)->first();

        return parent::parserResult($paymentPlan);
    }
}
