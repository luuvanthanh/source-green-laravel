<?php

namespace GGPHP\Crm\SsoAccount\Presenters;

use GGPHP\Crm\SsoAccount\Transformers\SsoAccountTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CityPresenter.
 *
 * @package namespace App\Presenters;
 */
class SsoAccountPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'SsoAccount';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'SsoAccount';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new SsoAccountTransformer();
    }
}
