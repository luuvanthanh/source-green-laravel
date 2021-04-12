<?php

namespace GGPHP\Reward\Presenters;

use GGPHP\Reward\Transformers\DecisionRewardTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class DecisionRewardPresenter.
 *
 * @package namespace App\Presenters;
 */
class DecisionRewardPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'DecisionReward';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'DecisionReward';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new DecisionRewardTransformer();
    }
}
