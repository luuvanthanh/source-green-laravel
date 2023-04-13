<?php

namespace GGPHP\InterviewManager\Presenters;

use GGPHP\InterviewManager\Transformers\InterviewListTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ChildrenPresenter.
 *
 * @package namespace GGPHP\Children\Presenters;
 */
class InterviewListPresenter extends FractalPresenter
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
        return new InterviewListTransformer();
    }
}
