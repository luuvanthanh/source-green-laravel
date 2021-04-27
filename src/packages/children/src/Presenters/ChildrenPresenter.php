<?php

namespace GGPHP\Children\Presenters;

use GGPHP\Children\Transformers\ChildrenTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ChildrenPresenter.
 *
 * @package namespace GGPHP\Children\Presenters;
 */
class ChildrenPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Children';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Children';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ChildrenTransformer();
    }
}
