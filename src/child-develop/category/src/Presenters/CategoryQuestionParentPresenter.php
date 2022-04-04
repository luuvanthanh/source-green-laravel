<?php

namespace GGPHP\ChildDevelop\Category\Presenters;

use GGPHP\ChildDevelop\Category\Transformers\CategoryQuestionParentTransformer;
use GGPHP\Crm\Category\Transformers\QuestionReviewTransformer;
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
