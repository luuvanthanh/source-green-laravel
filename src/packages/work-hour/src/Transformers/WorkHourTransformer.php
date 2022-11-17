<?php

namespace GGPHP\WorkHour\Transformers;

use Carbon\Carbon;
use GGPHP\Absent\Transformers\AbsentTypeTransformer;
use GGPHP\Config\Models\ConfigNotification;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Transformers\UserTransformer;
use GGPHP\WorkHour\Models\WorkHour;

/**
 * Class WorkHourTransformer.
 *
 * @package namespace GGPHP\WorkHour\Transformers;
 */
class WorkHourTransformer extends BaseTransformer
{

    protected $availableIncludes = ['employee', 'absentType', 'approvalEmployeeWorkHour'];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        $buttonSendAgainEdit = $this->buttonSendAgainEdit($model);

        return [
            'Status' => array_search($model->Status, WorkHour::STATUS),
            'RegistrationDateType' => array_search($model->RegistrationDateType, WorkHour::REGISTRATION_DATE_TYPE),
            'Hours' => json_decode($model->Hours),
            'buttonSendAgainEdit' => $buttonSendAgainEdit
        ];
    }

    public function buttonSendAgainEdit($model)
    {
        $buttonSendAgainEdit = false;
        $configNotification  = ConfigNotification::where('Type', ConfigNotification::TYPE['WORK_HOUR'])->first();

        if (!is_null($configNotification)) {
            $dateNow = Carbon::now();
            $dateNow = $dateNow->format('Ymd H');
            $hour = json_decode($model->Hours);
            $workHour = Carbon::parse($model->Date)->subDays($configNotification->Date)->format('Ymd') . Carbon::parse($hour[0]->in)->subHour($configNotification->Hour)->format('H');
            
            if ($model->Status == WorkHour::STATUS['WAITING_APPROVAL'] && $dateNow < $workHour) {
                $buttonSendAgainEdit = true;
            }
        }

        return $buttonSendAgainEdit;
    }

    /**
     * Include User
     * @param  WorkHour $workHour
     */
    public function includeEmployee(WorkHour $workHour)
    {
        if (empty($workHour->employee)) {
            return;
        }

        return $this->item($workHour->employee, new UserTransformer, 'Employee');
    }

    /**
     * Include User
     * @param  WorkHour $workHour
     */
    public function includeAbsentType(WorkHour $workHour)
    {
        if (empty($workHour->absentType)) {
            return;
        }

        return $this->item($workHour->absentType, new AbsentTypeTransformer, 'AbsentType');
    }

    public function includeApprovalEmployeeWorkHour(WorkHour $workHour)
    {
        return $this->collection($workHour->approvalEmployeeWorkHour, new ApprovalEmployeeWorkHourTransformer, 'ApprovalEmployeeWorkHour');
    }
}
