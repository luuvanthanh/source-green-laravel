<?php

namespace GGPHP\ApiShare\Presenters;

use GGPHP\ApiShare\Transformers\ApiShareTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ApiSharePresenter.
 *
 * @package namespace App\Presenters;
 */
class ApiSharePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'ApiShare';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'ApiShare';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ApiShareTransformer();
    }
}
