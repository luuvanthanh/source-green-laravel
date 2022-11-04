<?php

namespace GGPHP\StudyProgram\Setting\Presenters;

use GGPHP\StudyProgram\Setting\Transformers\EvaluationCriteriaTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ReviewPresenter.
 *
 * @package namespace App\Presenters;
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
