<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\FeePolicie;

/**
 * Class FeePolicieTransformer.
 *
 * @package namespace GGPHP\Fee\Transformers;
 */
class FeePolicieTransformer extends BaseTransformer
{

    protected $availableIncludes = ['schoolYear'];
    protected $defaultIncludes = ['feeDetail', 'moneyMeal', 'otherMoneyDetail', 'moneyBus'];

    public function customAttributes($model): array
    {
        return [];
    }

    /**
     * Include SchoolYearInformation
     * @param FeePolicie $feePolicie
     * @return \League\Fractal\Resource\Item
     */
    public function includeSchoolYearInformation(FeePolicie $feePolicie)
    {
        return $this->collection($feePolicie->schoolYearInformation, new SchoolYearInformationTransformer, 'SchoolYearInformation');
    }

    /**
     * Include FeeDetail
     * @param FeePolicie $feePolicie
     * @return \League\Fractal\Resource\Item
     */
    public function includeFeeDetail(FeePolicie $feePolicie)
    {
        return $this->collection($feePolicie->feeDetail, new FeeDetailTransformer, 'FeeDetail');
    }

    /**
     * Include MoneyMeal
     * @param FeePolicie $feePolicie
     * @return \League\Fractal\Resource\Item
     */
    public function includeMoneyMeal(FeePolicie $feePolicie)
    {
        return $this->collection($feePolicie->moneyMeal, new MoneyMealTransformer, 'MoneyMeal');
    }

    /**
     * Include OtherMoneyDetail
     * @param FeePolicie $feePolicie
     * @return \League\Fractal\Resource\Item
     */
    public function includeOtherMoneyDetail(FeePolicie $feePolicie)
    {
        return $this->collection($feePolicie->otherMoneyDetail, new OtherMoneyDetailTransformer, 'OtherMoneyDetail');
    }

    /**
     * Include SchoolYear
     * @param FeePolicie $feePolicie
     * @return \League\Fractal\Resource\Item
     */
    public function includeSchoolYear(FeePolicie $feePolicie)
    {
        if (empty($feePolicie->schoolYear)) {
            return;
        }

        return $this->item($feePolicie->schoolYear, new SchoolYearTransformer, 'SchoolYear');
    }

    public function includeMoneyBus(FeePolicie $feePolicie)
    {
        return $this->collection($feePolicie->moneyBus, new MoneyBusTransformer, 'MoneyBus');
    }
}
