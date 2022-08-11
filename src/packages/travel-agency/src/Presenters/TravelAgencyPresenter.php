<?php

namespace GGPHP\TravelAgency\Presenters;

use GGPHP\TravelAgency\Transformers\TravelAgencyTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class TravelAgencyPresenter.
 *
 * @package namespace App\Presenters;
 */
class TravelAgencyPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'TravelAgency';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'TravelAgency';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TravelAgencyTransformer();
    }
}
