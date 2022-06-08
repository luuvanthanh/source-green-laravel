<?php

namespace GGPHP\Refund\Presenters;

use GGPHP\Refund\Transformers\RefundStudentTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ChildrenPresenter.
 *
 * @package namespace GGPHP\Children\Presenters;
 */
class RefundStudentPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'RefundStudent';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'RefundStudent';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new RefundStudentTransformer();
    }
}
