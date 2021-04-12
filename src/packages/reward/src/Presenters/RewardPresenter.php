<?php

namespace GGPHP\Reward\Presenters;

use GGPHP\Reward\Transformers\RewardTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class UserPresenter.
 *
 * @package namespace App\Presenters;
 */
class RewardPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Reward';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Reward';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new RewardTransformer();
    }
}
