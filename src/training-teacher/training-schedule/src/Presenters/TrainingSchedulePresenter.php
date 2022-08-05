<?php

namespace GGPHP\TrainingTeacher\TrainingSchedule\Presenters;

use GGPHP\TrainingTeacher\TrainingSchedule\Transformers\TrainingScheduleTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class TypeTeacherPresenter.
 *
 * @package namespace App\Presenters;
 */
class TrainingSchedulePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'TrainingSchedule';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'TrainingSchedule';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TrainingScheduleTransformer();
    }
}
