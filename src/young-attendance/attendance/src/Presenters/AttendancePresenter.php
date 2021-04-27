<?php

namespace GGPHP\Attendance\Presenters;

use GGPHP\Attendance\Transformers\AttendanceTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class AttendancePresenter.
 *
 * @package namespace GGPHP\Attendance\Presenters;
 */
class AttendancePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Attendance';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Attendance';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new AttendanceTransformer();
    }
}
