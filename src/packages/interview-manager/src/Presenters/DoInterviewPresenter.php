<?php

namespace GGPHP\InterviewManager\Presenters;

use GGPHP\InterviewManager\Transformers\DoInterviewTransformer;
use GGPHP\InterviewManager\Transformers\InterviewListTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ChildrenPresenter.
 *
 * @package namespace GGPHP\Children\Presenters;
 */
class DoInterviewPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'DoInterview';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'DoInterview';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new DoInterviewTransformer();
    }
}
