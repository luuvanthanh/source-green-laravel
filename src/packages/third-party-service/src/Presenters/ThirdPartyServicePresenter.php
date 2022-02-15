<?php

namespace GGPHP\ThirdPartyService\Presenters;

use GGPHP\ThirdPartyService\Transformers\ThirdPartyServiceTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ThirdPartyServicePresenter.
 *
 * @package namespace App\Presenters;
 */
class ThirdPartyServicePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'ThirdPartyService';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'ThirdPartyService';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ThirdPartyServiceTransformer();
    }
}
