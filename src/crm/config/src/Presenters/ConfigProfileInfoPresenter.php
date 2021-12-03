<?php

namespace GGPHP\Crm\Config\Presenters;

use GGPHP\Crm\Config\Transformers\ConfigProfileInfoTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class ConfigProfileInfoPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ConfigProfileInfo';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ConfigProfileInfo';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ConfigProfileInfoTransformer();
    }
}
