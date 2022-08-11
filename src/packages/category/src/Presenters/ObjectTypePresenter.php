<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\ObjectTypeTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ObjectTypePresenter.
 *
 * @package namespace App\Presenters;
 */
class ObjectTypePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ObjectType';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ObjectType';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ObjectTypeTransformer();
    }
}
