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
    public $resourceKeyItem = 'Classes';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Classes';

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
