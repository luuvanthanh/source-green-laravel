<?php

namespace GGPHP\StudyProgram\AttendancePhysical\Presenters;

use GGPHP\StudyProgram\AttendancePhysical\Transformers\AttendancePhysicalTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ReviewPresenter.
 *
 * @package namespace App\Presenters;
 */
class AttendancePhysicalPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'AttendancePhysical';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'AttendancePhysical';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new AttendancePhysicalTransformer();
    }
}
