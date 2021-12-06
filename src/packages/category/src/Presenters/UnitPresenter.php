<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\UnitTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class UnitPresenter.
 *
 * @package namespace App\Presenters;
 */
class UnitPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Unit';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Unit';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new UnitTransformer();
    }
}
