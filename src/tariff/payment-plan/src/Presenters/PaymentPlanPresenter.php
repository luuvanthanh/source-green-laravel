<?php

namespace GGPHP\Tariff\PaymentPlan\Presenters;

use GGPHP\Tariff\PaymentPlan\Transformers\PaymentPlanTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class UserPresenter.
 *
 * @package namespace App\Presenters;
 */
class PaymentPlanPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'PaymentPlan';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'PaymentPlan';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new PaymentPlanTransformer();
    }
}
