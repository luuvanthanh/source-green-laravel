<?php

namespace GGPHP\BusinessCard\Transformers;

use Carbon\Carbon;
use GGPHP\Absent\Transformers\AbsentTypeTransformer;
use GGPHP\BusinessCard\Models\BusinessCard;
use GGPHP\Config\Models\ConfigNotification;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class BusinessCardTransformer.
 *
 * @package namespace GGPHP\BusinessCard\Transformers;
 */
class BusinessCardTransformer extends BaseTransformer
{

    protected $availableIncludes = ['employee', 'approvalEmployee'];
    protected $defaultIncludes = ['businessCardDetail', 'absentType'];

    public function customAttributes($model): array
    {
        $buttonSendAgainEdit = $this->buttonSendAgainEdit($model);

        return [
            'Status' => array_search($model->Status, BusinessCard::STATUS),
            'buttonSendAgainEdit' => $buttonSendAgainEdit
        ];
    }

    public function buttonSendAgainEdit($model)
    {
        $buttonSendAgainEdit = false;
        $configNotification  = ConfigNotification::where('Type', ConfigNotification::TYPE['BUSINESS_CARD'])->first();

        if (!is_null($configNotification)) {
            $dateNow = Carbon::now();
            $dateNow = $dateNow->format('YmdH');
            $businessCardDetail = $model->businessCardDetail()->orderBy('Date', 'asc')->first();
            $dateBusinessCard = Carbon::parse($model->StartDate)->subDays($configNotification->Date)->format('Ymd') . Carbon::parse($businessCardDetail->StartTime)->subHour($configNotification->Hour)->format('H');

            if ($model->Status == BusinessCard::STATUS['WAITING_APPROVAL'] && $dateNow < $dateBusinessCard) {
                $buttonSendAgainEdit = true;
            }
        }

        return $buttonSendAgainEdit;
    }

    /**
     * Include User
     * @param  BusinessCard $businessCard
     */
    public function includeEmployee(BusinessCard $businessCard)
    {
        if (empty($businessCard->employee)) {
            return;
        }

        return $this->item($businessCard->employee, new UserTransformer, 'Employee');
    }

    /**
     * Include User
     * @param  BusinessCard $businessCard
     */
    public function includeBusinessCardDetail(BusinessCard $businessCard)
    {
        return $this->collection($businessCard->businessCardDetail, new BusinessCardDetailTransformer, 'BusinessCardDetail');
    }

    /**
     * Include User
     * @param  BusinessCard $businessCard
     */
    public function includeAbsentType(BusinessCard $businessCard)
    {
        if (empty($businessCard->absentType)) {
            return;
        }

        return $this->item($businessCard->absentType, new AbsentTypeTransformer, 'AbsentType');
    }

    public function includeApprovalEmployee(BusinessCard $businessCard)
    {
        return $this->collection($businessCard->approvalEmployee, new ApprovalEmployeeTransformer, 'ApprovalEmployee');
    }
}
