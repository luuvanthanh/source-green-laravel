<?php

namespace GGPHP\InterviewManager\Presenters;

use GGPHP\InterviewManager\Transformers\InterviewerTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ChildrenPresenter.
 *
 * @package namespace GGPHP\Children\Presenters;
 */
class InterviewerPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Interviewer';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Interviewer';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new InterviewerTransformer();
    }
}
