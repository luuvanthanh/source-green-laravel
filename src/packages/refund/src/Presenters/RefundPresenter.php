<?php

namespace GGPHP\Refund\Presenters;

use GGPHP\Refund\Transformers\RefundTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ChildrenPresenter.
 *
 * @package namespace GGPHP\Children\Presenters;
 */
class RefundPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Refund';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Refund';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new RefundTransformer();
    }
}
