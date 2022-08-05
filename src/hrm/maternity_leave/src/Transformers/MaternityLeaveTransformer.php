<?php

namespace GGPHP\MaternityLeave\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\MaternityLeave\Models\MaternityLeave;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class MaternityLeaveTransformer.
 *
 * @package namespace GGPHP\MaternityLeave\Transformers;
 */
class MaternityLeaveTransformer extends BaseTransformer
{

    protected $availableIncludes = ['employee'];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        return [

        ];
    }

    /**
     * Include User
     * @param  MaternityLeave $maternityLeave
     */
    public function includeEmployee(MaternityLeave $maternityLeave)
    {
        if (empty($maternityLeave->employee)) {
            return;
        }

        return $this->item($maternityLeave->employee, new UserTransformer, 'Employee');
    }
}
