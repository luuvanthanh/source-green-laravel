<?php

namespace GGPHP\ShiftSchedule\Presenters;

use GGPHP\ShiftSchedule\Transformers\ShiftTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ShiftPresenter.
 *
 * @package namespace GGPHP\ShiftSchedule\Presenters;
 */
class ShiftPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Shift';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Shift';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ShiftTransformer();
    }
}
