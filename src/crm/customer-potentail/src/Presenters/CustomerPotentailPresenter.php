<?php

namespace GGPHP\Crm\CustomerPotentail\Presenters;

use GGPHP\Crm\CustomerPotentail\Transformers\CustomerPotentailTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CityPresenter.
 *
 * @package namespace App\Presenters;
 */
class CustomerPotentailPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'CustomerPotentail';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'CustomerPotentail';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CustomerPotentailTransformer();
    }
}
