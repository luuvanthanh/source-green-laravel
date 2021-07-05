<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\ParameterTaxLogTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ParameterTaxLogPresenter.
 *
 * @package namespace App\Presenters;
 */
class ParameterTaxLogPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ParameterTaxLog';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ParameterTaxLog';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ParameterTaxLogTransformer();
    }
}
