<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\PositionTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class PositionPresenter.
 *
 * @package namespace App\Presenters;
 */
class PositionPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'Position';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'Position';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new PositionTransformer();
    }
}
