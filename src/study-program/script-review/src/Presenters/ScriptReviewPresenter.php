<?php

namespace GGPHP\StudyProgram\ScriptReview\Presenters;

use GGPHP\StudyProgram\ScriptReview\Transformers\ScriptReviewTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ReviewPresenter.
 *
 * @package namespace App\Presenters;
 */
class ScriptReviewPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ScriptReview';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ScriptReview';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ScriptReviewTransformer();
    }
}
