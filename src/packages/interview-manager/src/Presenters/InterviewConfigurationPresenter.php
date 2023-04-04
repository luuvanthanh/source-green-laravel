<?php

namespace GGPHP\InterviewManager\Presenters;

use GGPHP\InterviewManager\Transformers\InterviewConfigurationTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ChildrenPresenter.
 *
 * @package namespace GGPHP\Children\Presenters;
 */
class InterviewConfigurationPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'InterviewConfiguration';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'InterviewConfiguration';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new InterviewConfigurationTransformer();
    }
}
