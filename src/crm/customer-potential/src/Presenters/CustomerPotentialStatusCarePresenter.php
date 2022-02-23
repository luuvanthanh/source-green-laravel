<?php

namespace GGPHP\Crm\CustomerPotential\Presenters;

use GGPHP\Crm\CustomerPotential\Transformers\CustomerPotentialStatusCareTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ReferencePresenter.
 *
 * @package namespace App\Presenters;
 */
class CustomerPotentialStatusCarePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'CustomerPotentialStatusCare';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'CustomerPotentialStatusCare';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CustomerPotentialStatusCareTransformer();
    }
}
