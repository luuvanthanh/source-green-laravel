<?php

namespace GGPHP\Arkki\Presenters;

use GGPHP\Arkki\Transformers\TeachingShiftTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class StudentPresenter.
 *
 * @package namespace App\Presenters;
 */
class TeachingShiftPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'TeachingShift';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'TeachingShift';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TeachingShiftTransformer();
    }
}
