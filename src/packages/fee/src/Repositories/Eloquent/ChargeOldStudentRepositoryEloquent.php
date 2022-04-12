<?php

namespace GGPHP\Fee\Repositories\Eloquent;

use CloudCreativity\LaravelJsonApi\Utils\Arr;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fee\Models\ChargeOldStudent;
use GGPHP\Fee\Models\DetailPaymentAccountant;
use GGPHP\Fee\Presenters\ChargeOldStudentPresenter;
use GGPHP\Fee\Repositories\Contracts\ChargeOldStudentRepository;
use GGPHP\Fee\Services\ChargeOldStudentService;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class ChargeOldStudentRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ChargeOldStudentRepositoryEloquent extends CoreRepositoryEloquent implements ChargeOldStudentRepository
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
        return ChargeOldStudent::class;
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
        return ChargeOldStudentPresenter::class;
    }

    public function filterChargeOldStudent(array $attributes)
    {
        if (!empty($attributes['nameStudent'])) {
            $this->model = $this->model->whereHas('student', function ($query) use ($attributes) {
                $query->whereLike('FullName', $attributes['nameStudent']);
            });
        }

        if (!empty($attributes['month'])) {
            $this->model = $this->model->whereHas('schoolYear', function ($query) use ($attributes) {
                $query->where('StartDate', '<=', $attributes['month'])->where('EndDate', '>=', $attributes['month']);
            });
        }

        if (!empty($attributes['schoolYearId'])) {
            $this->model = $this->model->where('SchoolYearId', $attributes['schoolYearId']);
        }

        if (!empty($attributes['studentId'])) {
            $studentId = explode(',', $attributes['studentId']);
            $this->model = $this->model->whereIn('StudentId', $studentId);
        }

        if (!empty($attributes['from']) && !empty($attributes['to'])) {
            $this->model = $this->model->whereHas('schoolYear', function ($query) use ($attributes) {
                $query->where(function ($q) use ($attributes) {
                    $q->where([['YearFrom', '<=', $attributes['from']], ['YearTo', '>=', $attributes['to']]])
                        ->orWhere([['YearFrom', '>', $attributes['from']], ['YearFrom', '<=', $attributes['to']]])
                        ->orWhere([['YearTo', '>=', $attributes['from']], ['YearTo', '<', $attributes['to']]]);
                });
            });
        }

        if (!empty($attributes['branchId'])) {
            $this->model = $this->model->whereHas('student', function ($q) use ($attributes) {
                $q->whereHas('classStudent', function ($query) use ($attributes) {
                    $query->whereHas('classes', function ($queryBranch) use ($attributes) {
                        $queryBranch->where('BranchId', $attributes['branchId']);
                    });
                });
            });
        }

        if (!empty($attributes['classId'])) {
            $this->model = $this->model->whereHas('student', function ($query) use ($attributes) {
                $query->where('ClassId', $attributes['classId']);
            });
        }

        if (!empty($attributes['limit'])) {
            $paymentForm = $this->paginate($attributes['limit']);
        } else {
            $paymentForm = $this->get();
        }

        return $paymentForm;
    }

    public function create(array $attributes)
    {
        DB::beginTransaction();
        try {
            $chargeStudent = ChargeOldStudent::create($attributes);

            $totalMoney = 0;
            if (!empty($attributes['tuition'])) {
                foreach ($attributes['tuition'] as $value) {

                    foreach ($value as $key => $item) {
                        $newkey = dashesToCamelCase($key, true);

                        if ($key != $newkey) {
                            $value[$newkey] = $value[$key];
                            unset($value[$key]);
                        }
                    }
                    $chargeStudent->tuition()->create($value);
                }
            }

            $totalMoney = array_sum(array_column($attributes['expectedToCollectMoney'], 'total_money_month'));
            $chargeStudent->update(['TotalMoney' => $totalMoney]);

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($chargeStudent);
    }

    public function update(array $attributes, $id)
    {
        DB::beginTransaction();
        try {
            $chargeStudent = ChargeOldStudent::findOrFail($id);

            $chargeStudent->update($attributes);

            $totalMoney = 0;
            if (!empty($attributes['tuition'])) {
                $chargeStudent->tuition()->delete();

                foreach ($attributes['tuition'] as $value) {

                    foreach ($value as $key => $item) {
                        $newkey = dashesToCamelCase($key, true);

                        if ($key != $newkey) {
                            $value[$newkey] = $value[$key];
                            unset($value[$key]);
                        }
                    }
                    $chargeStudent->tuition()->create($value);
                }
            }

            $totalMoney = array_sum(array_column($attributes['expectedToCollectMoney'], 'total_money_month'));
            $chargeStudent->update(['TotalMoney' => $totalMoney]);

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($id);
    }

    public function chargeOldStudentDetailPayment(array $attributes)
    {
        $dataCrm = [];
        foreach ($attributes['data'] as $value) {
            $chargeOldStudent = ChargeOldStudent::find($value['chargeOldStudenId']);
            $chargeOldStudent->update(['PaymentStatus' => ChargeOldStudent::PAYMENT_STATUS[$value['paymentStatus']]]);

            foreach ($value['detail'] as $valueDetail) {
                $valueDetail['ChargeOldStudentId'] = $chargeOldStudent->Id;
                DetailPaymentAccountant::create($valueDetail);
            }

            switch ($chargeOldStudent->PaymentStatus) {
                case '1':
                    $status = 'UNPAID';
                    break;
                case '2':
                    $status = 'PAYING';
                    break;
                case '3':
                    $status = 'PAID';
                    break;
                default:
            }

            if (!is_null($chargeOldStudent->ChargeStudentIdCrm)) {
                $dataCrm[] = [
                    'charge_student_id' => $chargeOldStudent->ChargeStudentIdCrm,
                    'status' => $status
                ];
            }
        }
 
        if (!empty($dataCrm)) {
            ChargeOldStudentService::updateStatusStudentCrm($dataCrm);
        }

        return parent::find($chargeOldStudent->Id);
    }
}
