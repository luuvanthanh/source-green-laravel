<?php

namespace GGPHP\Crm\WebForm\Presenters;

use GGPHP\Crm\WebForm\Transformers\WebFormCustomerTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class WebFormCustomerPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'WebFormCustomer';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'WebFormCustomer';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new WebFormCustomerTransformer();
    }
}
