<?php

namespace GGPHP\Fee\Transformers;

use Carbon\Carbon;
use Carbon\CarbonPeriod;
use GGPHP\Clover\Transformers\StudentTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\ChargeOldStudent;
use Illuminate\Support\Facades\Route;

/**
 * Class ChargeOldStudentTransformer.
 *
 * @package namespace GGPHP\Fee\Transformers;
 */
class ChargeOldStudentTransformer extends BaseTransformer
{

    protected $availableIncludes = ['student', 'tuition', 'schoolYear'];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        $attributes = [];
        $routeName  = Route::currentRouteName();

        if ($routeName == 'accountant.charge-old-students') {
            $attributes['expectedToCollectMoney'] = $this->expectedToCollectMoney($model);
        }

        return $attributes;
    }

    public function expectedToCollectMoney($model)
    {
        $startDate = $model->schoolYear->StartDate;
        $endDate = $model->schoolYear->EndDate;

        $tuition = $model->tuition;
        $rangeMonth = collect(CarbonPeriod::create($startDate, '1 month', $endDate)->toArray());

        $data = [];
        $monthFilter = request()->month;

        if (!empty(request()->month)) {
            $monthFilter = explode(',', $monthFilter);
        }

        foreach ($rangeMonth as $keyMonth => $month) {
            $fee = [];

            if (!empty($monthFilter) && !in_array($month->format('Y-m'), $monthFilter)) {
                continue;
            }

            foreach ($tuition as $key => $value) {
                $paymentForm = $value->paymentForm;
                $applyDate = Carbon::parse($value->ApplyDate)->format('Y-m');

                switch ($paymentForm->Code) {
                    case 'NAM':
                        if ($applyDate == $month->format('Y-m')) {
                            $fee[] = [
                                'fee_id' => $value->FeeId,
                                'fee_name' => $value->fee->Name,
                                'money' => $value->Money
                            ];
                        } else {
                            $fee[] = [
                                'fee_id' => $value->FeeId,
                                'fee_name' => $value->fee->Name,
                                'money' => 0
                            ];
                        }
                        break;
                    case 'THANG':
                        if ($applyDate <= $month->format('Y-m')) {
                            $fee[] = [
                                'fee_id' => $value->FeeId,
                                'fee_name' => $value->fee->Name,
                                'money' => $value->Money
                            ];
                        } else {
                            $fee[] = [
                                'fee_id' => $value->FeeId,
                                'fee_name' => $value->fee->Name,
                                'money' => 0
                            ];
                        }
                        break;
                    case 'HOCKY1':
                        $isMonth = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $model->schoolYear->changeParameter->Id)
                            ->whereHas('paymentForm', function ($query) {
                                $query->where('Code', 'HOCKY1');
                            })->whereMonth('Date', $month->format('m'))->whereYear('Date', $month->format('Y'))->first();

                        if ($applyDate == $month->format('Y-m') && !is_null($isMonth)) {
                            $fee[] = [
                                'fee_id' => $value->FeeId,
                                'fee_name' => $value->fee->Name,
                                'money' => $value->Money
                            ];
                        } elseif (!is_null($isMonth)) {
                            $fee[] = [
                                'fee_id' => $value->FeeId,
                                'fee_name' => $value->fee->Name,
                                'money' => 0
                            ];
                        }
                        break;
                    case 'HOCKY2':
                        $isMonth = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $model->schoolYear->changeParameter->Id)
                            ->whereHas('paymentForm', function ($query) {
                                $query->where('Code', 'HOCKY2');
                            })->whereMonth('Date', $month->format('m'))->whereYear('Date', $month->format('Y'))->first();

                        if ($applyDate == $month->format('Y-m') && !is_null($isMonth)) {
                            $fee[] = [
                                'fee_id' => $value->FeeId,
                                'fee_name' => $value->fee->Name,
                                'money' => $value->Money
                            ];
                        } elseif (!is_null($isMonth)) {
                            $fee[] = [
                                'fee_id' => $value->FeeId,
                                'fee_name' => $value->fee->Name,
                                'money' => 0
                            ];
                        }
                        break;
                }
            }

            $data[] = [
                'month' =>  $month->format('Y-m'),
                'fee' => $fee
            ];
        }

        return $data;
    }
    /**
     * Include Owner
     * @param ChargeOldStudent $chargeOldStudent
     * @return \League\Fractal\Resource\Item
     */
    public function includeTuition(ChargeOldStudent $chargeOldStudent)
    {
        return $this->collection($chargeOldStudent->tuition, new OldStudentTuitionTransformer, 'Tuition');
    }

    /**
     * Include SchoolYear
     * @param ChargeOldStudent $chargeOldStudent
     * @return \League\Fractal\Resource\Item
     */
    public function includeSchoolYear(ChargeOldStudent $chargeOldStudent)
    {
        if (empty($chargeOldStudent->schoolYear)) {
            return;
        }

        return $this->item($chargeOldStudent->schoolYear, new SchoolYearTransformer, 'SchoolYear');
    }

    /**
     * Include Student
     * @param ChargeOldStudent $chargeOldStudent
     * @return \League\Fractal\Resource\Item
     */
    public function includeStudent(ChargeOldStudent $chargeOldStudent)
    {
        if (empty($chargeOldStudent->student)) {
            return;
        }

        return $this->item($chargeOldStudent->student, new StudentTransformer, 'Student');
    }
}
