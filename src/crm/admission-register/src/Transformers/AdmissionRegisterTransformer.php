<?php

namespace GGPHP\Crm\AdmissionRegister\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\AdmissionRegister\Models\AdmissionRegister;
use GGPHP\Crm\Category\Transformers\StatusAdmissionRegisterTransformer;
use GGPHP\Crm\CustomerLead\Transformers\StudentInfoTransformer;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class AdmissionRegisterTransformer extends BaseTransformer
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
    protected $availableIncludes = ['studentInfo', 'parentInfo', 'statusAdmissionRegister', 'testInput', 'medicalInfo', 'confirmTransporter', 'childEvaluateInfo', 'studentByChargeNow'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param  

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $register_status = null;

        foreach (AdmissionRegister::REGISTER_STATUS as $key => $value) {
            if ($value == $model->register_status) {
                $register_status = $key;
            }
        }

        return [
            'register_status' => $register_status
        ];
    }

    public function includeStudentInfo(AdmissionRegister $admissionRegister)
    {
        if (empty($admissionRegister->studentInfo)) {
            return;
        }

        return $this->item($admissionRegister->studentInfo, new StudentInfoTransformer, 'StudentInfo');
    }

    public function includeParentInfo(AdmissionRegister $admissionRegister)
    {
        return $this->collection($admissionRegister->parentInfo, new ParentInfoTransformer, 'ParentInfo');
    }

    public function includeStatusAdmissionRegister(AdmissionRegister $admissionRegister)
    {
        if (empty($admissionRegister->statusAdmissionRegister)) {
            return;
        }

        return $this->item($admissionRegister->statusAdmissionRegister, new StatusAdmissionRegisterTransformer, 'StatusAdmissionRegister');
    }

    public function includeTestInput(AdmissionRegister $admissionRegister)
    {
        if (empty($admissionRegister->testInput)) {
            return;
        }

        return $this->item($admissionRegister->testInput, new TestInputTransformer, 'TestInput');
    }

    public function includeMedicalInfo(AdmissionRegister $admissionRegister)
    {
        if (empty($admissionRegister->medicalInfo)) {
            return;
        }

        return $this->item($admissionRegister->medicalInfo, new MedicalInfoTransformer, 'MedicalInfo');
    }

    public function includeConfirmTransporter(AdmissionRegister $admissionRegister)
    {
        return $this->collection($admissionRegister->confirmTransporter, new ConfirmTransporterTransformer, 'ConfirmTransporter');
    }

    public function includeChildEvaluateInfo(AdmissionRegister $admissionRegister)
    {
        return $this->collection($admissionRegister->childEvaluateInfo, new ChildEvaluateInfoTransformer, 'ChildEvaluateInfo');
    }

    public function includeStudentByChargeNow(AdmissionRegister $admissionRegister)
    {
        if (empty($admissionRegister->studentByChargeNow)) {
            return null;
        }

        return $this->item($admissionRegister->studentByChargeNow, new StudentInfoTransformer, 'StudentByChargeNow');
    }
}
