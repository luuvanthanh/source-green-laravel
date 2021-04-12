<?php

namespace GGPHP\PositionLevel\Presenters;

use GGPHP\PositionLevel\Transformers\PositionLevelTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class PositionLevelPresenter.
 *
 * @package namespace App\Presenters;
 */
class PositionLevelPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'PositionLevel';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'PositionLevel';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new PositionLevelTransformer();
    }
}
