<?php

namespace GGPHP\Crm\Icon\Presenters;

use GGPHP\Crm\Icon\Transformers\CategoryIconTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class CategoryIconPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Icon';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Icon';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CategoryIconTransformer();
    }
}
