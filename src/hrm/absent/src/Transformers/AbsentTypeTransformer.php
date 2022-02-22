<?php

namespace GGPHP\Absent\Transformers;

use GGPHP\Absent\Models\AbsentReason;
use GGPHP\Absent\Models\AbsentType;
use GGPHP\Core\Transformers\BaseTransformer;

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
