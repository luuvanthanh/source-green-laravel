<?php

namespace GGPHP\ManualCalculation\Presenters;

use GGPHP\ManualCalculation\Transformers\ManualCalculationTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class BioPresenter.
 *
 * @package namespace App\Presenters;
 */
class ManualCalculationPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ManualCalculation';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ManualCalculation';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ManualCalculationTransformer();
    }
}
