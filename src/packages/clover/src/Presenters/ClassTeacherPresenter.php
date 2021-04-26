<?php

namespace GGPHP\Clover\Presenters;

use GGPHP\Clover\Transformers\ClassTeacherTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ClassTeacherPresenter.
 *
 * @package namespace App\Presenters;
 */
class ClassTeacherPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ClassTeacher';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ClassTeacher';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ClassTeacherTransformer();
    }

}
