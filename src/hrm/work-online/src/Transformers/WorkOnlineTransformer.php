<?php

namespace GGPHP\WorkOnline\Transformers;

use GGPHP\Absent\Transformers\AbsentTypeTransformer;
use GGPHP\WorkOnline\Models\WorkOnline;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class WorkOnlineTransformer.
 *
 * @package namespace GGPHP\WorkOnline\Transformers;
 */
class WorkOnlineTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    protected $availableIncludes = ['workOnlineDetail', 'absentType', 'employee'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    /**
     * Include Employee
     * @param WorkOnline $WorkOnline
     */
    public function includeEmployee(WorkOnline $workOnline)
    {
        return $this->item($workOnline->employee, new UserTransformer, 'Employee');
    }

    public function includeWorkOnlineDetail(WorkOnline $workOnline)
    {
        return $this->collection($workOnline->workOnlineDetail, new WorkOnlineDetailTransformer, 'WorkOnlineDetail');
    }

    public function includeAbsentType(WorkOnline $workOnline)
    {
        if (empty($workOnline->absentType)) {
            return;
        }

        return $this->item($workOnline->absentType, new AbsentTypeTransformer, 'AbsentType');
    }
}
