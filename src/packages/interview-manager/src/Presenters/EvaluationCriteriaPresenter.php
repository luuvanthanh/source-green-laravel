<?php

namespace GGPHP\InterviewManager\Presenters;

use GGPHP\InterviewManager\Transformers\EvaluationCriteriaTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ChildrenPresenter.
 *
 * @package namespace GGPHP\Children\Presenters;
 */
class EvaluationCriteriaPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'EvaluationCriteria';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'EvaluationCriteria';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new EvaluationCriteriaTransformer();
    }
}
