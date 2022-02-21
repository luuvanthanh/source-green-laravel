<?php

namespace GGPHP\Crm\Fee\Repositories\Eloquent;

use GGPHP\Crm\Fee\Models\ChargeStudent;
use GGPHP\Crm\Fee\Models\ClassType;
use GGPHP\Crm\Fee\Models\Fee;
use GGPHP\Crm\Fee\Models\PaymentForm;
use GGPHP\Crm\Fee\Models\SchoolYear;
use GGPHP\Crm\Fee\Presenters\ChargeStudentPresenter;
use GGPHP\Crm\Fee\Repositories\Contracts\ChargeStudentRepository;
use GGPHP\Crm\Fee\Services\ChargeStudentService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class SsoAccountRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ChargeStudentRepositoryEloquent extends BaseRepository implements ChargeStudentRepository
{

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ChargeStudent::class;
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
        return ChargeStudentPresenter::class;
    }

    public function getChargeStudent(array $attributes)
    {
        if (!empty($attributes['name_student'])) {
            $this->model = $this->model->whereLike('name_student', $attributes['name_student'])
                ->orWhereHas('studentInfo', function ($query) use ($attributes) {
                    $query->whereLike('full_name', $attributes['name_student']);
                });
        }

        if (!empty($attributes['limit'])) {
            $chargeStudent = $this->paginate($attributes['limit']);
        } else {
            $chargeStudent = $this->get();
        }

        return $chargeStudent;
    }

    public function create(array $attributes)
    {
        DB::beginTransaction();
        try {
            $chargeStudent = ChargeStudent::create($attributes);

            $totalMoney = 0;
            if (!empty($attributes['tuition'])) {
                foreach ($attributes['tuition'] as $value) {
                    $chargeStudent->tuition()->create($value);
                }
                $totalMoney = array_sum(array_column($attributes['tuition'], 'money'));
            }

            $chargeStudent->update(['total_money' => $totalMoney]);

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return $this->parserResult($chargeStudent);
    }

    public function update(array $attributes, $id)
    {
        DB::beginTransaction();
        try {
            $chargeStudent = ChargeStudent::findOrFail($id);

            $chargeStudent->update($attributes);

            $totalMoney = 0;
            if (!empty($attributes['tuition'])) {
                $chargeStudent->tuition()->delete();

                foreach ($attributes['tuition'] as $value) {
                    $chargeStudent->tuition()->create($value);
                }

                $totalMoney = array_sum(array_column($attributes['tuition'], 'money'));
            }

            $chargeStudent->update(['total_money' => $totalMoney]);

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($id);
    }

    public function moneyFeePolicie(array $attributes)
    {
        $classType = ClassType::find($attributes['class_type_id']);
        $schoolYear = SchoolYear::find($attributes['school_year_id']);

        $details = json_decode($attributes['details'], true);

        foreach ($details as  $item) {
            $fee = Fee::findOrfail($item['fee_id']);
            $paymentForm = PaymentForm::findOrfail($item['payment_form_id']);
            $params['details'][] = [
                'id' => isset($item['id']) ? $item['id'] : null,
                'feeId' => $fee->fee_clover_id,
                'paymentFormId'   => $paymentForm->payment_form_clover_id,
                'money' => isset($item['money']) ? $item['money'] : 0
            ];
        }

        //params send clover
        $details = json_encode($params['details']);
        $params['details'] = $details;
        $params['classTypeId'] = $classType->class_type_clover_id;
        $params['schoolYearId'] = $schoolYear->school_year_clover_id;
        $params['dayAdmission'] = $attributes['day_admission'];
        $params['student'] = $attributes['student'];

        $data = ChargeStudentService::moneyFeePolicie($params);

        $attributes['details'] = json_decode($details, true);
        
        foreach ($data['data'] as $key => $item) {
            $attributes['details'][$key]['money'] = $item['money'];
        }

        return $attributes;
    }
}
