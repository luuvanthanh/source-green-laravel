<?php

namespace GGPHP\DecisionSuspend\Presenters;

use GGPHP\DecisionSuspend\Transformers\DecisionSuspendTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class DecisionSuspendPresenter.
 *
 * @package namespace App\Presenters;
 */
class DecisionSuspendPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'DecisionSuspend';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'DecisionSuspend';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new DecisionSuspendTransformer();
    }
}
