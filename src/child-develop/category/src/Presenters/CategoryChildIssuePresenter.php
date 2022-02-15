<?php

namespace GGPHP\ChildDevelop\Category\Presenters;

use GGPHP\ChildDevelop\Category\Transformers\CategoryChildIssueTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class CategoryChildIssuePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'CategoryChildIssue';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'CategoryChildIssue';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CategoryChildIssueTransformer();
    }
}
