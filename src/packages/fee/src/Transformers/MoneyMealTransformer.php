<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\MoneyMeal;

/**
 * Class MoneyMealTransformer.
 *
 * @package namespace GGPHP\MoneyMeal\Transformers;
 */
class MoneyMealTransformer extends BaseTransformer
{

    protected $availableIncludes = [];
    protected $defaultIncludes = ['paymentForm', 'classType'];

    public function customAttributes($model): array
    {
        return [

        ];
    }

    /**
     * Include PaymentForm
     * @param MoneyMeal $moneyMeal
     * @return \League\Fractal\Resource\Item
     */
    public function includePaymentForm(MoneyMeal $moneyMeal)
    {
        if (empty($moneyMeal->paymentForm)) {
            return;
        }

        return $this->item($moneyMeal->paymentForm, new PaymentFormTransformer, 'PaymentForm');
    }

    /**
     * Include ClassType
     * @param MoneyMeal $moneyMeal
     * @return \League\Fractal\Resource\Item
     */
    public function includeClassType(MoneyMeal $moneyMeal)
    {
        if (empty($moneyMeal->classType)) {
            return;
        }

        return $this->item($moneyMeal->classType, new ClassTypeTransformer, 'ClassType');
    }
}
