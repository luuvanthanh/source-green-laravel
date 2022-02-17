<?php

namespace GGPHP\Crm\CustomerPotential\Presenters;

use GGPHP\Crm\CustomerPotential\Transformers\CustomerPotentialTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CityPresenter.
 *
 * @package namespace App\Presenters;
 */
class CustomerPotentialPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'CustomerPotential';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'CustomerPotential';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CustomerPotentialTransformer();
    }
}
