<?php

namespace GGPHP\Crm\CustomerLead\Presenters;

use GGPHP\Crm\CustomerLead\Transformers\CustomerTagTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class EventInfoPresenter.
 *
 * @package namespace App\Presenters;
 */
class CustomerTagPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'CustomerTag';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'CustomerTag';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CustomerTagTransformer();
    }
}
