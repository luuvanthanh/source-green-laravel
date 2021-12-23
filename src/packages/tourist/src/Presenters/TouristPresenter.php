<?php

namespace GGPHP\Tourist\Presenters;

use GGPHP\Tourist\Transformers\TouristTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class TouristPresenter.
 *
 * @package namespace App\Presenters;
 */
class TouristPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'Tourist';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'Tourist';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TouristTransformer();
    }
}
