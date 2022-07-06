<?php

namespace GGPHP\Profile\Presenters;

use GGPHP\Profile\Transformers\NumberFormContractTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class NumberFormContractPresenter.
 *
 * @package namespace GGPHP\Profile\Presenters;
 */
class NumberFormContractPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'NumberFormContract';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'NumberFormContract';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new NumberFormContractTransformer();
    }
}
