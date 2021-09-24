<?php

namespace GGPHP\Crm\Category\Presenters;

use GGPHP\Crm\Category\Transformers\StatusParentPotentialTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class StatusParentPotentialPresenter.
 *
 * @package namespace App\Presenters;
 */
class StatusParentPotentialPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'StatusParentPotential';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'StatusParentPotential';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new StatusParentPotentialTransformer();
    }
}
