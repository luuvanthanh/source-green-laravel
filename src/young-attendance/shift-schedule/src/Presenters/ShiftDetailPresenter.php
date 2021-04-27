<?php

namespace GGPHP\YoungAttendance\ShiftSchedule\Presenters;

use GGPHP\YoungAttendance\ShiftSchedule\Transformers\ShiftDetailTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ShiftDetailPresenter.
 *
 * @package namespace GGPHP\YoungAttendance\ShiftSchedule\Presenters;
 */
class ShiftDetailPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ShiftDetail';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ShiftDetail';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ShiftDetailTransformer();
    }
}
