<?php

namespace GGPHP\Crm\CustomerPotential\Presenters;

use GGPHP\Crm\CustomerPotential\Transformers\CustomerPotentialEventInfoTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CustomerPotentialEventInfoPresenter.
 *
 * @package namespace App\Presenters;
 */
class CustomerPotentialEventInfoPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'CustomerPotentialEventInfo';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'CustomerPotentialEventInfo';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CustomerPotentialEventInfoTransformer();
    }
}
