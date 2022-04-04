<?php

namespace GGPHP\Tariff\PaymentPlan\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\ChargeOldStudentTransformer;
use GGPHP\Tariff\PaymentPlan\Models\PaymentPlanDetail;

/**
 * Class UserTransformer.
 *
 * @package namespace App\Transformers;
 */
class PaymentPlanDetailTransformer extends BaseTransformer
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
    protected $availableIncludes = ['chargeOldStudent'];

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

    public function includeChargeOldStudent(PaymentPlanDetail $paymentPlanDetail)
    {
        if (is_null($paymentPlanDetail->chargeOldStudent)) {
            return;
        }

        return $this->item($paymentPlanDetail->chargeOldStudent, new ChargeOldStudentTransformer, 'ChargeOldStudent');
    }
}
