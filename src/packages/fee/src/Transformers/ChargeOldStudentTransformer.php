<?php

namespace GGPHP\Fee\Transformers;

use Carbon\Carbon;
use Carbon\CarbonPeriod;
use GGPHP\Category\Transformers\BranchTransformer;
use GGPHP\Clover\Transformers\ClassesTransformer;
use GGPHP\Clover\Transformers\StudentTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\ChargeOldStudent;
use GGPHP\Fee\Models\ChargeStudent;
use GGPHP\Fee\Models\Fee;
use Illuminate\Support\Facades\Route;

/**
 * Class ChargeOldStudentTransformer.
 *
 * @package namespace GGPHP\Fee\Transformers;
 */
class ChargeOldStudentTransformer extends BaseTransformer
{

    protected $availableIncludes = ['student', 'tuition', 'schoolYear', 'detailPaymentAccountant', 'branch', 'classType', 'class'];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        $attributes = [];
        $route = Route::currentRouteName();

        if ($route == 'accountant.charge-old-students') {

            if (!empty(request()->month)) {
                $param = Carbon::parse(request()->month)->format('Y-m');
                $attributes['ExpectedToCollectMoney'] = $this->dataChargeStudentByMonth($param, $model);
            }
        }
        $attributes['PaymentStatus'] = array_search($model->PaymentStatus, $model::PAYMENT_STATUS);

        return $attributes;
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

    public function dataChargeStudentByMonth($param, $model)
    {
        $collection = collect($model->ExpectedToCollectMoney);
        $expectedToCollectMoney = $collection->filter(function ($value, $key) use ($param) {

            if (!empty($value['month'])) {
                return $value['month'] == $param;
            }
        });

        return $expectedToCollectMoney->all();
    }

    public function includeDetailPaymentAccountant(ChargeOldStudent $chargeOldStudent)
    {
        return $this->collection($chargeOldStudent->detailPaymentAccountant, new DetailPaymentAccountantTransformer, 'DetailPaymentAccountant');
    }

    public function includeBranch(ChargeOldStudent $chargeOldStudent)
    {
        if (empty($chargeOldStudent->branch)) {
            return;
        }

        return $this->item($chargeOldStudent->branch, new BranchTransformer, 'Branch');
    }

    public function includeClassType(ChargeOldStudent $chargeOldStudent)
    {
        if (empty($chargeOldStudent->classType)) {
            return;
        }

        return $this->item($chargeOldStudent->classType, new ClassTypeTransformer, 'ClassType');
    }

    public function includeClass(ChargeOldStudent $chargeOldStudent)
    {
        if (empty($chargeOldStudent->class)) {
            return;
        }

        return $this->item($chargeOldStudent->class, new ClassesTransformer, 'Class');
    }
}
