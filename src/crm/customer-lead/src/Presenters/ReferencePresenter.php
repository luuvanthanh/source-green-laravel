<?php

namespace GGPHP\Crm\CustomerLead\Presenters;

use GGPHP\Crm\CustomerLead\Transformers\ReferenceTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ReferencePresenter.
 *
 * @package namespace App\Presenters;
 */
class ReferencePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Reference';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Reference';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ReferenceTransformer();
    }
}
