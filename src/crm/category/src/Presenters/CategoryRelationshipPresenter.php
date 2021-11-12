<?php

namespace GGPHP\Crm\Category\Presenters;

use GGPHP\Crm\Category\Transformers\CategoryEventTransformer;
use GGPHP\Crm\Category\Transformers\CategoryRelationshipTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class StatusParentPotentialPresenter.
 *
 * @package namespace App\Presenters;
 */
class CategoryRelationshipPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'CategoryRelationship';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'CategoryRelationship';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CategoryRelationshipTransformer();
    }
}
