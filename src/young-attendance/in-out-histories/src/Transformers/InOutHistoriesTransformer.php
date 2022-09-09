<?php

namespace GGPHP\InOutHistories\Transformers;

use GGPHP\Clover\Transformers\StudentTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\SchoolYearTransformer;
use GGPHP\InOutHistories\Models\InOutHistories;

/**
 * Class InOutHistoriesTransformer.
 *
 * @package namespace GGPHP\InOutHistories\Transformers;
 */
class InOutHistoriesTransformer extends BaseTransformer
{

    protected $availableIncludes = ['student', 'schoolYear'];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        return [];
    }

    /**
     * Include Student
     * @param  InOutHistories $inOutHistories
     */
    public function includeStudent(InOutHistories $inOutHistories)
    {
        if (empty($inOutHistories->student)) {
            return;
        }

        return $this->item($inOutHistories->student, new StudentTransformer, 'Student');
    }

    /**
     * Include Student
     * @param  InOutHistories $inOutHistories
     */
    public function includeSchoolYear(InOutHistories $inOutHistories)
    {
        if (empty($inOutHistories->schoolYear)) {
            return;
        }

        return $this->item($inOutHistories->schoolYear, new SchoolYearTransformer, 'SchoolYear');
    }
}
