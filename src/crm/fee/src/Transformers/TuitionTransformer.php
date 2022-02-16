<?php

namespace GGPHP\Crm\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Fee\Models\Tuition;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class TuitionTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['chargeStudent'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param  

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeChargeStudent(Tuition $tuition)
    {
        if ($tuition->loadCount('chargeStudent')->charge_student_count < 1) {
            return null;
        }

        return $this->item($tuition->chargeStudent, new ChargeStudentTransformer, 'ChargeStudent');
    }
}
