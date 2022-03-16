<?php

namespace GGPHP\EvaluateTeacher\Category\Presenters;

use GGPHP\EvaluateTeacher\Category\Transformers\TypeTeacherTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class TypeTeacherPresenter.
 *
 * @package namespace App\Presenters;
 */
class TypeTeacherPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'TypeTeacher';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'TypeTeacher';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TypeTeacherTransformer();
    }
}
