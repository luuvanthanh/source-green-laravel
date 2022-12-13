<?php

namespace GGPHP\ExpectedTime\Presenters;

use GGPHP\ExpectedTime\Transformers\ExpectedTimeTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class UserPresenter.
 *
 * @package namespace App\Presenters;
 */
class ExpectedTimePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ExpectedTime';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ExpectedTime';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ExpectedTimeTransformer();
    }
}
