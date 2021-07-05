<?php

namespace GGPHP\Salary\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Salary\Models\Payroll;

/**
 * Class PayrollTransformer.
 *
 * @package namespace GGPHP\Salary\Transformers;
 */
class PayrollTransformer extends BaseTransformer
{

    protected $availableIncludes = ['payrollDetail'];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        return [
            'ColumnBasicSalaryAndAllowance' => json_decode($model->ColumnBasicSalaryAndAllowance),
            'ColumnIncurredAllowance' => json_decode($model->ColumnIncurredAllowance),
        ];
    }

    /**
     * Include Owner
     * @param Payroll $absent
     * @return \League\Fractal\Resource\Item
     */
    public function includePayrollDetail(Payroll $payroll)
    {
        return $this->collection($payroll->payrollDetail, new PayrollDetailTransformer, 'PayrollDetail');
    }
}
