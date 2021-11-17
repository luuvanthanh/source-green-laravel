<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\TouristDestinationTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class TouristDestinationPresenter.
 *
 * @package namespace App\Presenters;
 */
class TouristDestinationPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'TouristDestination';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'TouristDestination';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TouristDestinationTransformer();
    }
}
