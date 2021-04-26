<?php

namespace GGPHP\YoungAttendance\ShiftSchedule\Presenters;

use GGPHP\YoungAttendance\ShiftSchedule\Transformers\ShiftTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ShiftPresenter.
 *
 * @package namespace GGPHP\YoungAttendance\ShiftSchedule\Presenters;
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
