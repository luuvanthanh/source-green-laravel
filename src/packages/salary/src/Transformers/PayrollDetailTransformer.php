<?php

namespace GGPHP\Salary\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Salary\Models\PayRollDetail;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class PayRollDetailTransformer.
 *
 * @package namespace GGPHP\Salary\Transformers;
 */
class PayRollDetailTransformer extends BaseTransformer
{

    protected $availableIncludes = ['employee'];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        return [
            // 'BasicSalaryAndAllowance' => json_decode($model->BasicSalaryAndAllowance),
            // 'IncurredAllowance' => json_decode($model->IncurredAllowance),
        ];
    }

    /**
     * Include AbsentType
     * @param PayRollDetail $absent
     * @return \League\Fractal\Resource\Item
     */
    public function includeEmployee(PayRollDetail $payRollDetail)
    {
        if (empty($payRollDetail->employee)) {
            return;
        }

        return $this->item($payRollDetail->employee, new UserTransformer, 'Employee');
    }
}
