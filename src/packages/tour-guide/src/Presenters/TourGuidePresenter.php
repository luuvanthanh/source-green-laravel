<?php

namespace GGPHP\TourGuide\Presenters;

use GGPHP\TourGuide\Transformers\TourGuideTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class TourGuidePresenter.
 *
 * @package namespace App\Presenters;
 */
class TourGuidePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'TourGuide';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'TourGuide';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TourGuideTransformer();
    }
}
