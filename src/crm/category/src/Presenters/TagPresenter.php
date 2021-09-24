<?php

namespace GGPHP\Crm\Category\Presenters;

use GGPHP\Crm\Category\Transformers\TagTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class StatusParentPotentialPresenter.
 *
 * @package namespace App\Presenters;
 */
class TagPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Tag';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Tag';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new TagTransformer();
    }
}
