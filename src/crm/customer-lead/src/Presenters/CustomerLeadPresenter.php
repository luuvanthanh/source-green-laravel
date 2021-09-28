<?php

namespace GGPHP\Crm\CustomerLead\Presenters;

use GGPHP\Crm\CustomerLead\Transformers\CustomerLeadTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CityPresenter.
 *
 * @package namespace App\Presenters;
 */
class CustomerLeadPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'CustomerLead';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'CustomerLead';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CustomerLeadTransformer();
    }
}
