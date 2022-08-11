<?php

namespace GGPHP\SurveyForm\Presenters;

use GGPHP\SurveyForm\Transformers\HandleWorkTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class HandleWorkPresenter.
 *
 * @package namespace App\Presenters;
 */
class HandleWorkPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'HandleWork';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'HandleWork';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new HandleWorkTransformer();
    }
}
