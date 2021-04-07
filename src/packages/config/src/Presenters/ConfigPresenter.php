<?php

namespace GGPHP\Config\Presenters;

use GGPHP\Config\Transformers\ConfigTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ConfigPresenter.
 *
 * @package namespace App\Presenters;
 */
class ConfigPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Config';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Config';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ConfigTransformer();
    }
}
