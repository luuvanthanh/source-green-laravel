<?php

namespace GGPHP\Refund\Presenters;

use GGPHP\Refund\Transformers\RefundDetailTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ChildrenPresenter.
 *
 * @package namespace GGPHP\Children\Presenters;
 */
class ConfigRefundPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ConfigRefund';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ConfigRefund';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new RefundDetailTransformer();
    }
}
