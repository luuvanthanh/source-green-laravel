<?php

namespace GGPHP\Crm\Fee\Presenters;

use GGPHP\Crm\Fee\Transformers\PaymentFormTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CityPresenter.
 *
 * @package namespace App\Presenters;
 */
class PaymentFormPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'PaymentForm';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'PaymentForm';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new PaymentFormTransformer();
    }
}
