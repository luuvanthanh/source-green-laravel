<?php

namespace GGPHP\YoungAttendance\Absent\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\YoungAttendance\Absent\Models\AbsentReason;
use GGPHP\YoungAttendance\Absent\Models\AbsentType;

/**
 * Class UserTransformer.
 *
 * @package namespace App\Transformers;
 */
class AbsentTypeTransformer extends BaseTransformer
{
    protected $availableIncludes = ['absentReason'];

    /**
     * Include AbsentType
     * @param AbsentType $absentType
     * @return \League\Fractal\Resource\Collection
     */
    public function includeAbsentReason(AbsentType $absentType)
    {
        return $this->collection($absentType->absentReason, new AbsentReasonTransformer, 'AbsentReason');
    }
}
