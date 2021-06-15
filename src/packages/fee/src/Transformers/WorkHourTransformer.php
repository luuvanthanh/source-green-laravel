<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Absent\Transformers\AbsentTypeTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\Fee;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class FeeTransformer.
 *
 * @package namespace GGPHP\Fee\Transformers;
 */
class FeeTransformer extends BaseTransformer
{

    protected $availableIncludes = ['employee', 'absentType'];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        return [
            "Hours" => json_decode($model->Hours),
        ];
    }

    /**
     * Include User
     * @param  Fee $fee
     */
    public function includeEmployee(Fee $fee)
    {
        if (empty($fee->employee)) {
            return;
        }

        return $this->item($fee->employee, new UserTransformer, 'Employee');
    }

    /**
     * Include User
     * @param  Fee $fee
     */
    public function includeAbsentType(Fee $fee)
    {
        if (empty($fee->absentType)) {
            return;
        }

        return $this->item($fee->absentType, new AbsentTypeTransformer, 'AbsentType');
    }
}
