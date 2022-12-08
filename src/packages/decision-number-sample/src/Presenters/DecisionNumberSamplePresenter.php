<?php

namespace GGPHP\DecisionNumberSample\Presenters;

use GGPHP\DecisionNumberSample\Transformers\DecisionNumberSampleTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class DecisionNumberSamplePresenter.
 *
 * @package namespace App\Presenters;
 */
class DecisionNumberSamplePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'DecisionNumberSample';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'DecisionNumberSample';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new DecisionNumberSampleTransformer();
    }
}
