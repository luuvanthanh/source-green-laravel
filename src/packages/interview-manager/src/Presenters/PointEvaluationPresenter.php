<?php

namespace GGPHP\InterviewManager\Presenters;

use GGPHP\InterviewManager\Transformers\PointEvaluationTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ChildrenPresenter.
 *
 * @package namespace GGPHP\Children\Presenters;
 */
class PointEvaluationPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'PointEvaluation';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'PointEvaluation';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new PointEvaluationTransformer();
    }
}
