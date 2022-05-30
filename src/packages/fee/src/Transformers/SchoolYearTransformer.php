<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\SchoolYear;
use GGPHP\Refund\Transformers\RefundTransformer;

/**
 * Class SchoolYearTransformer.
 *
 * @package namespace GGPHP\Fee\Transformers;
 */
class SchoolYearTransformer extends BaseTransformer
{

    protected $availableIncludes = ['refund'];
    protected $defaultIncludes = ['fixedParameter', 'changeParameter', 'timetable'];

    public function customAttributes($model): array
    {
        return [];
    }

    /**
     * Include Owner
     * @param SchoolYear $schoolYear
     * @return \League\Fractal\Resource\Item
     */
    public function includeFixedParameter(SchoolYear $schoolYear)
    {
        return $this->collection($schoolYear->fixedParameter, new FixedParameterTransformer, 'FixedParameter');
    }

    /**
     * Include Owner
     * @param SchoolYear $schoolYear
     * @return \League\Fractal\Resource\Item
     */
    public function includeChangeParameter(SchoolYear $schoolYear)
    {
        if (empty($schoolYear->changeParameter)) {
            return;
        }

        return $this->item($schoolYear->changeParameter, new ChangeParameterTransformer, 'ChangeParameter');
    }

    /**
     * Include Owner
     * @param SchoolYear $schoolYear
     * @return \League\Fractal\Resource\Item
     */
    public function includeTimetable(SchoolYear $schoolYear)
    {
        return $this->collection($schoolYear->timetable, new TimetableTransformer, 'Timetable');
    }

    public function includeRefund(SchoolYear $schoolYear)
    {
        if (empty($schoolYear->refund)) {
            return null;
        }

        return $this->item($schoolYear->refund, new RefundTransformer, 'Refund');
    }
}
