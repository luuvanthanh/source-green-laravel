<?php

namespace GGPHP\Crm\Category\Presenters;

use GGPHP\Crm\Category\Transformers\QuestionReviewTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class QuestionReviewPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'QuestionReview';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'QuestionReview';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new QuestionReviewTransformer();
    }
}
