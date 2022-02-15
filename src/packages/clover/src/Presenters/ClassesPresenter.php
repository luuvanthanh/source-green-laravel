<?php

namespace GGPHP\Clover\Presenters;

use GGPHP\Clover\Transformers\ClassesTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ClassesPresenter.
 *
 * @package namespace App\Presenters;
 */
class ClassesPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Class';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Class';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ClassesTransformer();
    }
}
