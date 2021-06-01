<?php

namespace GGPHP\Attendance\Presenters;

use GGPHP\Attendance\Transformers\AttendanceReasonTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class AttendanceReasonPresenter.
 *
 * @package namespace GGPHP\Attendance\Presenters;
 */
class AttendanceReasonPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'AttendanceReason';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'AttendanceReason';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new AttendanceReasonTransformer();
    }
}
