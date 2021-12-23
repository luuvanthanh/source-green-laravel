<?php

namespace GGPHP\SurveyForm\Presenters;

use GGPHP\SurveyForm\Transformers\SurveyFormTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class SurveyFormPresenter.
 *
 * @package namespace App\Presenters;
 */
class SurveyFormPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'SurveyForm';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'SurveyForm';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new SurveyFormTransformer();
    }
}
