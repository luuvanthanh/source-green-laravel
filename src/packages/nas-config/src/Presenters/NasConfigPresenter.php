<?php

namespace GGPHP\NasConfig\Presenters;

use GGPHP\NasConfig\Transformers\NasConfigTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class NasConfigPresenter.
 *
 * @package namespace App\Presenters;
 */
class NasConfigPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'NasConfig';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'NasConfig';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new NasConfigTransformer();
    }
}
