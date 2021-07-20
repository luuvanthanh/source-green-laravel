<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Clover\Transformers\StudentTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\ChargeOldStudent;

/**
 * Class ChargeOldStudentTransformer.
 *
 * @package namespace GGPHP\Fee\Transformers;
 */
class ChargeOldStudentTransformer extends BaseTransformer
{

    protected $availableIncludes = [];
    protected $defaultIncludes = ['student', 'tuition', 'schoolYear'];

    public function customAttributes($model): array
    {
        return [];
    }

    /**
     * Include Owner
     * @param ChargeOldStudent $chargeOldStudent
     * @return \League\Fractal\Resource\Item
     */
    public function includeTuition(ChargeOldStudent $chargeOldStudent)
    {
        return $this->collection($chargeOldStudent->tuition, new OldStudentTuitionTransformer, 'Tuition');
    }

    /**
     * Include SchoolYear
     * @param ChargeOldStudent $chargeOldStudent
     * @return \League\Fractal\Resource\Item
     */
    public function includeSchoolYear(ChargeOldStudent $chargeOldStudent)
    {
        if (empty($chargeOldStudent->schoolYear)) {
            return;
        }

        return $this->item($chargeOldStudent->schoolYear, new SchoolYearTransformer, 'SchoolYear');
    }

    /**
     * Include Student
     * @param ChargeOldStudent $chargeOldStudent
     * @return \League\Fractal\Resource\Item
     */
    public function includeStudent(ChargeOldStudent $chargeOldStudent)
    {
        if (empty($chargeOldStudent->student)) {
            return;
        }

        return $this->item($chargeOldStudent->student, new StudentTransformer, 'Student');
    }
}
