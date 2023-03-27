<?php

namespace GGPHP\Clover\Presenters;

use GGPHP\Clover\Transformers\ClassProjectTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ClassesPresenter.
 *
 * @package namespace App\Presenters;
 */
class ClassProjectPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ClassProject';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ClassProject';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ClassProjectTransformer();
    }
}
