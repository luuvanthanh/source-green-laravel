<?php

namespace GGPHP\AiService\Presenters;

use GGPHP\AiService\Transformers\AiServiceTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class AiServicePresenter.
 *
 * @package namespace App\Presenters;
 */
class AiServicePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'AiService';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'AiService';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new AiServiceTransformer();
    }
}
