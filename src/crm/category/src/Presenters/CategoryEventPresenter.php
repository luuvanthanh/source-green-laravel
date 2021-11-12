<?php

namespace GGPHP\Crm\Category\Presenters;

use GGPHP\Crm\Category\Transformers\CategoryEventTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class StatusParentPotentialPresenter.
 *
 * @package namespace App\Presenters;
 */
class CategoryEventPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'CategoryEvent';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'CategoryEvent';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CategoryEventTransformer();
    }
}
