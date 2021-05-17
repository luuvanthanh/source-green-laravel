<?php

namespace GGPHP\ShiftSchedule\Presenters;

use GGPHP\ShiftSchedule\Transformers\DivisionShiftTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class DivisionShiftPresenter.
 *
 * @package namespace GGPHP\ShiftSchedule\Presenters;
 */
class DivisionShiftPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'DivisionShift';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'DivisionShift';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new DivisionShiftTransformer();
    }
}
