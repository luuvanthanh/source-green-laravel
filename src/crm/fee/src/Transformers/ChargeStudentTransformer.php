<?php

namespace GGPHP\Crm\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\AdmissionRegister\Transformers\AdmissionRegisterTransformer;
use GGPHP\Crm\CustomerLead\Transformers\StudentInfoTransformer;
use GGPHP\Crm\Fee\Models\ChargeStudent;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class ChargeStudentTransformer extends BaseTransformer
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
    protected $availableIncludes = ['studentInfo', 'tuition', 'admissionRegister'];

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

    public function includeStudentInfo(ChargeStudent $chargeStudent)
    {
        if ($chargeStudent->loadCount('studentInfo')->student_info_count < 1) {
            return null;
        }

        return $this->item($chargeStudent->studentInfo, new StudentInfoTransformer, 'StudentInfo');
    }

    public function includeTuition(ChargeStudent $chargeStudent)
    {
        return $this->collection($chargeStudent->tuition, new TuitionTransformer, 'Tuition');
    }

    public function includeAdmissionRegister(ChargeStudent $chargeStudent)
    {
        if ($chargeStudent->loadCount('admissionRegister')->admission_register_count < 1) {
            return null;
        }

        return $this->item($chargeStudent->admissionRegister, new AdmissionRegisterTransformer, 'AdmissionRegister');
    }
}
