<?php

namespace GGPHP\ChildDevelop\Category\Presenters;

use GGPHP\ChildDevelop\Category\Transformers\NameAssessmentPeriodTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class NameAssessmentPeriodPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'NameAssessmentPeriod';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'NameAssessmentPeriod';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new NameAssessmentPeriodTransformer();
    }
}
