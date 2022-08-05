<?php

namespace GGPHP\TrainingTeacher\Category\Presenters;

use GGPHP\TrainingTeacher\Category\Transformers\TrainingFormTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class TypeTeacherPresenter.
 *
 * @package namespace App\Presenters;
 */
class TrainingFormPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'TrainingForm';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'TrainingForm';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TrainingFormTransformer();
    }
}
