<?php

namespace GGPHP\Crm\Fee\Repositories\Eloquent;

use GGPHP\Crm\Category\Models\Branch;
use GGPHP\Crm\Fee\Models\ChargeStudent;
use GGPHP\Crm\Fee\Models\ClassType;
use GGPHP\Crm\Fee\Models\Fee;
use GGPHP\Crm\Fee\Models\PaymentForm;
use GGPHP\Crm\Fee\Models\SchoolYear;
use GGPHP\Crm\Fee\Presenters\ChargeStudentPresenter;
use GGPHP\Crm\Fee\Repositories\Contracts\ChargeStudentRepository;
use GGPHP\Crm\Fee\Services\ChargeStudentService;
use Illuminate\Support\Facades\DB;
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
            $attributes['status'] = $this->model()::STATUS['UNPAID'];

            $chargeStudent = ChargeStudent::create($attributes);

            $totalMoney = 0;
            if (!empty($attributes['tuition'])) {
                foreach ($attributes['tuition'] as $value) {
                    $chargeStudent->tuition()->create($value);
                }
            }

            $totalMoney = array_sum(array_column($attributes['expected_to_collect_money'], 'total_money_month'));

            $chargeStudent->update(['total_money' => $totalMoney]);

            if (!is_null($chargeStudent->admissionRegister)) {
                //param sync to charge old student hrm
                $params['studentId'] = $chargeStudent->admissionRegister->student_clover_id;
                $params['schoolYearId'] = $chargeStudent->schoolYear->school_year_clover_id;
                $params['dayAdmission'] = $chargeStudent->day_admission;
                $params['expectedToCollectMoney'] = $chargeStudent->expected_to_collect_money;
                $params['chargeStudentIdCrm'] = $chargeStudent->id;

                $tuitions = $chargeStudent->tuition->map(function ($item) {
                    return [
                        'FeeId' => $item->fee->fee_clover_id,
                        'PaymentFormId' => $item->paymentForm->payment_form_clover_id,
                        'Money' => $item->money
                    ];
                });

                $params['tuition'] = $tuitions;
                $result = ChargeStudentService::syncCreateChargeStudentHrm($params);
                $chargeStudent->update(['charge_student_hrm_id' => $result['data']['id']]);
            }
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

            if (!empty($attributes['tuition'])) {
                $chargeStudent->tuition()->delete();

                foreach ($attributes['tuition'] as $value) {
                    $chargeStudent->tuition()->create($value);
                }
            }

            $totalMoney = array_sum(array_column($attributes['expected_to_collect_money'], 'total_money_month'));

            $chargeStudent->update(['total_money' => $totalMoney]);

            if (!is_null($chargeStudent->admissionRegister)) {
                $params['studentId'] = $chargeStudent->admissionRegister->student_clover_id;
                $params['schoolYearId'] = $chargeStudent->schoolYear->school_year_clover_id;
                $params['dayAdmission'] = $chargeStudent->day_admission;
                $params['expectedToCollectMoney'] = $chargeStudent->expected_to_collect_money;
                $params['chargeStudentIdCrm'] = $chargeStudent->id;

                $tuitions = $chargeStudent->tuition->map(function ($item) {
                    return [
                        'FeeId' => $item->fee->fee_clover_id,
                        'PaymentFormId' => $item->paymentForm->payment_form_clover_id,
                        'Money' => $item->money
                    ];
                });

                $params['tuition'] = $tuitions;
                $result = ChargeStudentService::syncUpdateChargeStudentHrm($params, $chargeStudent->charge_student_hrm_id);

                $chargeStudent->update(['charge_student_hrm_id' => $result['data']['id']]);
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($id);
    }

    public function moneyFeePolicie(array $attributes)
    {
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

        $classType = ClassType::find($attributes['class_type_id']);
        $schoolYear = SchoolYear::find($attributes['school_year_id']);
        $branch = Branch::find($attributes['branch_id']);
        //params send clover
        $details = json_encode($params['details']);
        $params['details'] = $details;
        $params['classTypeId'] = $classType->class_type_clover_id;
        $params['schoolYearId'] = $schoolYear->school_year_clover_id;
        $params['dayAdmission'] = $attributes['day_admission'];
        $params['student'] = $attributes['student'];
        $params['branchId'] = $branch->branch_id_hrm;

        $data = ChargeStudentService::moneyFeePolicie($params);

        $attributes['details'] = json_decode($details, true);

        foreach ($data['data'] as $key => $item) {
            $attributes['details'][$key]['money'] = $item['money'];
        }

        return ['data' => $attributes['details'], 'data_details' => $data['detailData']];
    }

    public function updateStatusChargeStudent(array $attributes)
    {
        collect($attributes)->each(function ($item) {
            $this->model->findOrFail($item['charge_student_id'])->update(['status' => ChargeStudent::STATUS[$item['status']]]);
        });

        return [];
    }
}
