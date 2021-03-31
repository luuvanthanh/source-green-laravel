<?php

namespace GGPHP\LateEarly\Presenters;

use GGPHP\LateEarly\Transformers\LateEarlyTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class UserPresenter.
 *
 * @package namespace App\Presenters;
 */
class LateEarlyPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'LateEarly';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'LateEarly';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new LateEarlyTransformer();
    }
}
