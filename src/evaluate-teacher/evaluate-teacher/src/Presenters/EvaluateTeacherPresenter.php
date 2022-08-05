<?php

namespace GGPHP\EvaluateTeacher\EvaluateTeacher\Presenters;

use GGPHP\EvaluateTeacher\EvaluateTeacher\Transformers\EvaluateTeacherTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class EvaluateTeacherPresenter.
 *
 * @package namespace App\Presenters;
 */
class EvaluateTeacherPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'EvaluateTeacher';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'EvaluateTeacher';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new EvaluateTeacherTransformer();
    }
}
