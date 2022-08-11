<?php

namespace GGPHP\NumberOfTourist\Presenters;

use GGPHP\NumberOfTourist\Transformers\NumberOfTouristTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class NumberOfTouristPresenter.
 *
 * @package namespace App\Presenters;
 */
class NumberOfTouristPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'NumberOfTourist';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'NumberOfTourist';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new NumberOfTouristTransformer();
    }
}
