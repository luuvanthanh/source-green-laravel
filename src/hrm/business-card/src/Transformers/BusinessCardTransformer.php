<?php

namespace GGPHP\BusinessCard\Transformers;

use GGPHP\Absent\Transformers\AbsentTypeTransformer;
use GGPHP\BusinessCard\Models\BusinessCard;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class BusinessCardTransformer.
 *
 * @package namespace GGPHP\BusinessCard\Transformers;
 */
class BusinessCardTransformer extends BaseTransformer
{

    protected $availableIncludes = ['employee'];
    protected $defaultIncludes = ['businessCardDetail', 'absentType'];

    public function customAttributes($model): array
    {
        return [
        ];
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
}
