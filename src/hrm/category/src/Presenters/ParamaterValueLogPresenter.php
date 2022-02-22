<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\ParamaterValueLogTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ParamaterValueLogPresenter.
 *
 * @package namespace App\Presenters;
 */
class ParamaterValueLogPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ParamaterValueLog';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ParamaterValueLog';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ParamaterValueLogTransformer();
    }
}
