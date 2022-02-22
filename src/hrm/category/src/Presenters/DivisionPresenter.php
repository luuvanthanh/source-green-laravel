<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\DivisionTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class DivisionPresenter.
 *
 * @package namespace App\Presenters;
 */
class DivisionPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'Division';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'Division';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new DivisionTransformer();
    }
}
