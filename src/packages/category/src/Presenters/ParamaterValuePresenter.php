<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\ParamaterValueTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ParamaterValuePresenter.
 *
 * @package namespace App\Presenters;
 */
class ParamaterValuePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ParamaterValue';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ParamaterValue';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ParamaterValueTransformer();
    }
}
