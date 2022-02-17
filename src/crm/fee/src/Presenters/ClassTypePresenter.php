<?php

namespace GGPHP\Crm\Fee\Presenters;

use GGPHP\Crm\Fee\Transformers\ClassTypeTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CityPresenter.
 *
 * @package namespace App\Presenters;
 */
class ClassTypePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ClassType';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ClassType';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ClassTypeTransformer();
    }
}
