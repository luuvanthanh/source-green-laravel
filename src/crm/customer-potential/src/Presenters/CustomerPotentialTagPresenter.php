<?php

namespace GGPHP\Crm\CustomerPotential\Presenters;

use GGPHP\Crm\CustomerPotential\Transformers\CustomerPotentialTagTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CityPresenter.
 *
 * @package namespace App\Presenters;
 */
class CustomerPotentialTagPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'CustomerPotentialTag';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'CustomerPotentialTag';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CustomerPotentialTagTransformer();
    }
}
