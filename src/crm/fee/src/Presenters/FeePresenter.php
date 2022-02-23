<?php

namespace GGPHP\Crm\Fee\Presenters;

use GGPHP\Crm\Fee\Transformers\FeeTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CityPresenter.
 *
 * @package namespace App\Presenters;
 */
class FeePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Fee';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Fee';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new FeeTransformer();
    }
}
