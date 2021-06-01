<?php

namespace GGPHP\Attendance\Presenters;

use GGPHP\Attendance\Transformers\AttendanceLogTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class AttendanceLogPresenter.
 *
 * @package namespace GGPHP\Attendance\Presenters;
 */
class AttendanceLogPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'AttendanceLog';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'AttendanceLog';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new AttendanceLogTransformer();
    }
}
