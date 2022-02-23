<?php

namespace GGPHP\Crm\CustomerPotential\Presenters;

use GGPHP\Crm\CustomerPotential\Transformers\CustomerPotentialReferenceTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ReferencePresenter.
 *
 * @package namespace App\Presenters;
 */
class CustomerPotentialReferencePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'CustomerPotentialReference';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'CustomerPotentialReference';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CustomerPotentialReferenceTransformer();
    }
}
