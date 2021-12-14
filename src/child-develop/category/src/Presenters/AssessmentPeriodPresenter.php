<?php

namespace GGPHP\ChildDevelop\Category\Presenters;

use GGPHP\ChildDevelop\Category\Transformers\AssessmentPeriodTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class AssessmentPeriodPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'AssessmentPeriod';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'AssessmentPeriod';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new AssessmentPeriodTransformer();
    }
}
