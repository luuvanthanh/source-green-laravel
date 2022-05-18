<?php

namespace GGPHP\Refund\Presenters;

use GGPHP\Refund\Transformers\RefundDetailTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ChildrenPresenter.
 *
 * @package namespace GGPHP\Children\Presenters;
 */
class RefundDetailPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'RefundDetail';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'RefundDetail';

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
