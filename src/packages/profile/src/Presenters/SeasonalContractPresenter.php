<?php

namespace GGPHP\Profile\Presenters;

use GGPHP\Profile\Transformers\SeasonalContractTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class LabourContractPresenter.
 *
 * @package namespace GGPHP\Profile\Presenters;
 */
class SeasonalContractPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'SeasonalContract';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'SeasonalContract';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new SeasonalContractTransformer();
    }
}
