<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\CardTypeTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CardTypePresenter.
 *
 * @package namespace App\Presenters;
 */
class CardTypePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'CardType';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'CardType';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CardTypeTransformer();
    }
}
