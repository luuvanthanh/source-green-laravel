<?php

namespace GGPHP\StudyProgram\Setting\Presenters;

use GGPHP\StudyProgram\Setting\Transformers\SampleCommentTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ReviewPresenter.
 *
 * @package namespace App\Presenters;
 */
class SampleCommentPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'SampleComment';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'SampleComment';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new SampleCommentTransformer();
    }
}
