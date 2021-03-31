<?php

namespace GGPHP\Absent\Transformers;

use GGPHP\Absent\Models\AbsentReason;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class UserTransformer.
 *
 * @package namespace App\Transformers;
 */
class AbsentReasonTransformer extends BaseTransformer
{
    protected $availableIncludes = ['absentType'];

    /**
     * Include AbsentType
     * @param AbsentReason $absentReason
     * @return \League\Fractal\Resource\Item
     */
    public function includeAbsentType(AbsentReason $absentReason)
    {
        if (empty($absentReason->absentType)) {
            return;
        }

        return $this->item($absentReason->absentType, new AbsentTypeTransformer(), 'AbsentType');
    }
}
