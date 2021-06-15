<?php

namespace GGPHP\Fee\Presenters;

use GGPHP\Fee\Transformers\FeeTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class FeePresenter.
 *
 * @package namespace App\Presenters;
 */
class FeePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Fee';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Fee';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new FeeTransformer();
    }
}
