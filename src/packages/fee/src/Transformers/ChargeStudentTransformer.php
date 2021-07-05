<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\ChargeStudent;

/**
 * Class ChargeStudentTransformer.
 *
 * @package namespace GGPHP\Fee\Transformers;
 */
class ChargeStudentTransformer extends BaseTransformer
{

    protected $availableIncludes = [];
    protected $defaultIncludes = ['tuition', 'schoolYear'];

    public function customAttributes($model): array
    {
        return [

        ];
    }

    /**
     * Include Owner
     * @param ChargeStudent $chargeStudent
     * @return \League\Fractal\Resource\Item
     */
    public function includeTuition(ChargeStudent $chargeStudent)
    {
        return $this->collection($chargeStudent->tuition, new TuitionTransformer, 'Tuition');
    }

    /**
     * Include SchoolYear
     * @param ChargeStudent $chargeStudent
     * @return \League\Fractal\Resource\Item
     */
    public function includeSchoolYear(ChargeStudent $chargeStudent)
    {
        if (empty($chargeStudent->schoolYear)) {
            return;
        }

        return $this->item($chargeStudent->schoolYear, new SchoolYearTransformer, 'SchoolYear');
    }

}
