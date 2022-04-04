<?php

namespace GGPHP\Tariff\PaymentPlan\Transformers;

use GGPHP\Category\Transformers\BranchTransformer;
use GGPHP\Clover\Transformers\ClassesTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\ClassTypeTransformer;
use GGPHP\Fee\Transformers\SchoolYearTransformer;
use GGPHP\Tariff\PaymentPlan\Models\PaymentPlan;
use GGPHP\Tariff\PaymentPlan\Transformers\PaymentPlanDetailTransformer;

/**
 * Class UserTransformer.
 *
 * @package namespace App\Transformers;
 */
class PaymentPlanTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['paymentPlanDetail', 'schoolYear', 'branch', 'classes', 'classType'];

    /**
     * Transform the User entity.
     *
     * @param $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includePaymentPlanDetail(PaymentPlan $PaymentPlan)
    {
        return $this->collection($PaymentPlan->paymentPlanDetail, new PaymentPlanDetailTransformer, 'PaymentPlanDetail');
    }

    public function includeSchoolYear(PaymentPlan $paymentPlan)
    {
        if (empty($paymentPlan->schoolYear)) {
            return;
        }

        return $this->item($paymentPlan->schoolYear, new SchoolYearTransformer, 'SchoolYear');
    }

    public function includeBranch(PaymentPlan $paymentPlan)
    {
        if (empty($paymentPlan->branch)) {
            return;
        }

        return $this->item($paymentPlan->branch, new BranchTransformer, 'Branch');
    }

    public function includeClasses(PaymentPlan $paymentPlan)
    {
        if (empty($paymentPlan->classes)) {
            return;
        }

        return $this->item($paymentPlan->classes, new ClassesTransformer, 'Classes');
    }

    public function includeClassType(PaymentPlan $paymentPlan)
    {
        if (empty($paymentPlan->classType)) {
            return;
        }

        return $this->item($paymentPlan->classType, new ClassTypeTransformer, 'ClassType');
    }
}
