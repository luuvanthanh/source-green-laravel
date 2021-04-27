<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\ParamaterFormulaLogTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ParamaterFormulaLogPresenter.
 *
 * @package namespace App\Presenters;
 */
class ParamaterFormulaLogPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ParamaterFormulaLog';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ParamaterFormulaLog';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ParamaterFormulaLogTransformer();
    }
}
