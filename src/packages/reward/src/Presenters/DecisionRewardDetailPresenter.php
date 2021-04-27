<?php

namespace GGPHP\Reward\Presenters;

use GGPHP\Reward\Transformers\DecisionRewardDetailTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class DecisionRewardDetailPresenter.
 *
 * @package namespace App\Presenters;
 */
class DecisionRewardDetailPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'DecisionRewardDetail';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'DecisionRewardDetail';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new DecisionRewardDetailTransformer();
    }
}
