<?php

namespace GGPHP\SurveyForm\Presenters;

use GGPHP\SurveyForm\Transformers\SurveyFormResultTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class SurveyFormResultPresenter.
 *
 * @package namespace App\Presenters;
 */
class SurveyFormResultPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'SurveyFormResult';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'SurveyFormResult';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new SurveyFormResultTransformer();
    }
}
