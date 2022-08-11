<?php

namespace GGPHP\ApiShare\Presenters;

use GGPHP\ApiShare\Transformers\AccessApiTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class AccessApiPresenter.
 *
 * @package namespace App\Presenters;
 */
class AccessApiPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'AccessApi';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'AccessApi';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new AccessApiTransformer();
    }
}
