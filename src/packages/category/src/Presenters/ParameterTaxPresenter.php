<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\ParameterTaxTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ParameterTaxPresenter.
 *
 * @package namespace App\Presenters;
 */
class ParameterTaxPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ParameterTax';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ParameterTax';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ParameterTaxTransformer();
    }
}
