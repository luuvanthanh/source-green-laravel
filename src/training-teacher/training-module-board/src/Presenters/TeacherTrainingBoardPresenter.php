<?php

namespace GGPHP\TrainingTeacher\TrainingModuleBoard\Presenters;

use GGPHP\TrainingTeacher\TrainingModuleBoard\Transformers\TeacherTrainingBoardTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class TypeTeacherPresenter.
 *
 * @package namespace App\Presenters;
 */
class TeacherTrainingBoardPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'TeacherTrainingBoard';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'TeacherTrainingBoard';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TeacherTrainingBoardTransformer();
    }
}
