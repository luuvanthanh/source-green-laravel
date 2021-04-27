<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\ParamaterFormulaTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ParamaterFormulaPresenter.
 *
 * @package namespace App\Presenters;
 */
class ParamaterFormulaPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ParamaterFormula';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ParamaterFormula';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ParamaterFormulaTransformer();
    }
}
