<?php

namespace GGPHP\StudyProgram\MonthlyComment\Presenters;

use GGPHP\StudyProgram\MonthlyComment\Transformers\MonthlyCommentTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ReviewPresenter.
 *
 * @package namespace App\Presenters;
 */
class MonthlyCommentPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'MonthlyComment';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'MonthlyComment';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new MonthlyCommentTransformer();
    }
}
