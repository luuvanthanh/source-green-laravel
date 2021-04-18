<?php

namespace GGPHP\WorkHour\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Transformers\UserTransformer;
use GGPHP\WorkHour\Models\WorkHour;

/**
 * Class WorkHourTransformer.
 *
 * @package namespace GGPHP\WorkHour\Transformers;
 */
class WorkHourTransformer extends BaseTransformer
{

    protected $availableIncludes = ['employee'];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        return [
            "Hours" => json_decode($model->Hours),
        ];
    }

    /**
     * Include User
     * @param  WorkHour $workHour
     */
    public function includeEmployee(WorkHour $workHour)
    {
        if (empty($workHour->employee)) {
            return;
        }

        return $this->item($workHour->employee, new UserTransformer, 'Employee');
    }
}
