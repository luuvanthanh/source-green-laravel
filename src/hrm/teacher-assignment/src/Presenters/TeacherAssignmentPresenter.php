<?php

namespace GGPHP\TeacherAssignment\Presenters;

use GGPHP\TeacherAssignment\Transformers\TeacherAssignmentTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class TeacherAssignmentPresenter.
 *
 * @package namespace App\Presenters;
 */
class TeacherAssignmentPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'TeacherAssignment';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'TeacherAssignment';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TeacherAssignmentTransformer();
    }
}
