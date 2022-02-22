<?php

namespace GGPHP\ShiftSchedule\Presenters;

use GGPHP\ShiftSchedule\Transformers\ScheduleTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class SchedulePresenter.
 *
 * @package namespace GGPHP\ShiftSchedule\Presenters;
 */
class SchedulePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Schedule';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Schedule';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ScheduleTransformer();
    }
}
