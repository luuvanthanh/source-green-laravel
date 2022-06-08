<?php

namespace GGPHP\Refund\Presenters;

use GGPHP\Refund\Transformers\StudentRefundDetailTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ChildrenPresenter.
 *
 * @package namespace GGPHP\Children\Presenters;
 */
class StudentRefundDetailPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'StudentRefundDetail';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'StudentRefundDetail';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new StudentRefundDetailTransformer();
    }
}
