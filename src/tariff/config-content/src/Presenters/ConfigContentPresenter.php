<?php

namespace GGPHP\Tariff\ConfigContent\Presenters;

use GGPHP\Tariff\ConfigContent\Transformers\ConfigContentTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class UserPresenter.
 *
 * @package namespace App\Presenters;
 */
class ConfigContentPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ConfigContent';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ConfigContent';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ConfigContentTransformer();
    }
}
