<?php

namespace GGPHP\Crm\ChildDevelop\Presenters;

use GGPHP\Crm\ChildDevelop\Transformers\CategoryQuestionParentTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class CategoryQuestionParentPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'CategoryQuestionParent';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'CategoryQuestionParent';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CategoryQuestionParentTransformer();
    }
}
