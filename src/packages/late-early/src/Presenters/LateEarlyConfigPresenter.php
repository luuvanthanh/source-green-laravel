<?php

namespace GGPHP\LateEarly\Presenters;

use GGPHP\LateEarly\Transformers\LateEarlyConfigTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class UserPresenter.
 *
 * @package namespace App\Presenters;
 */
class LateEarlyConfigPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'LateEarlyConfig';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'LateEarlyConfig';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new LateEarlyConfigTransformer();
    }
}
