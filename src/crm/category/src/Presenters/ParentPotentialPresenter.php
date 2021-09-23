<?php

namespace GGPHP\Crm\Category\Presenters;

use GGPHP\Crm\Category\Transformers\ParentPotentialTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ParentPotentialPresenter.
 *
 * @package namespace App\Presenters;
 */
class ParentPotentialPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ParentPotential';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ParentPotential';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ParentPotentialTransformer();
    }
}
