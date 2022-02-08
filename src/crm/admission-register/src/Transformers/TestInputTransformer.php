<?php

namespace GGPHP\Crm\AdmissionRegister\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\AdmissionRegister\Models\TestInput;
use GGPHP\Crm\Employee\Transformers\EmployeeTransformer;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class TestInputTransformer extends BaseTransformer
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
    protected $availableIncludes = ['employee', 'admissionRegister', 'testInputDetail'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param  

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $status = null;
        $approvalStatus = null;

        foreach (TestInput::STATUS as $key => $value) {
            if (!is_null($model->status)) {
                if ($model->status == $value) {
                    $status = $key;
                }
            }
        }

        foreach (TestInput::APPROVAL_STATUS as $key => $value) {
            if (!is_null($model->approval_status)) {
                if ($model->approval_status == $value) {
                    $approvalStatus = $key;
                }
            }
        }

        return [
            'status' => $status,
            'approval_status' => $approvalStatus
        ];
    }

    public function customMeta(): array
    {
        $data = [];

        if (request()->is_summary_test_input && request()->is_summary_test_input == 'true') {

            $items = $this->getCurrentScope()->getResource()->getData();
            $status = $items->groupBy('status')->map->count()->toArray();
            ksort($status);
            $untesting = isset($status[0]) ? $status[0] : 0;
            $testing = isset($status[1]) ? $status[1] : 0;
            $finish = isset($status[2]) ? $status[2] : 0;
            $cancel = isset($status[3]) ? $status[3] : 0;

            $data['test_input'] = [
                'total_untesting' => $untesting + $cancel,
                'total_testing' => $testing,
                'total_finish' => $finish,
            ];
        }

        if (request()->is_summary_test_approval && request()->is_summary_test_approval == 'true') {
            $items = $this->getCurrentScope()->getResource()->getData();
            $approvalStatus = $items->groupBy('approval_status')->map->count()->toArray();
            ksort($approvalStatus);

            $unsent = isset($approvalStatus[0]) ? $approvalStatus[0] : 0;
            $unqualified = isset($approvalStatus[1]) ? $approvalStatus[1] : 0;
            $approved = isset($approvalStatus[2]) ? $approvalStatus[2] : 0;

            $data['approval_status'] = [
                'total_unsent' => $unsent,
                'total_unqualified' => $unqualified,
                'total_approval' => $approved,
            ];
        }

        return $data;
    }

    public function includeEmployee(TestInput $testInput)
    {
        if (empty($testInput->employee)) {
            return;
        }

        return $this->item($testInput->employee, new EmployeeTransformer, 'Employee');
    }

    public function includeAdmissionRegister(TestInput $testInput)
    {
        if (empty($testInput->admissionRegister)) {
            return;
        }

        return $this->item($testInput->admissionRegister, new AdmissionRegisterTransformer, 'AdmissionRegister');
    }

    public function includeTestInputDetail(TestInput $testInput)
    {
        return $this->collection($testInput->testInputDetail, new TestInputDetailTransformer, 'TestInputDetail');
    }
}
