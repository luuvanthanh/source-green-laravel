<?php

namespace GGPHP\Crm\CustomerLead\Presenters;

use GGPHP\Crm\CustomerLead\Transformers\StatusCareTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ReferencePresenter.
 *
 * @package namespace App\Presenters;
 */
class StatusCarePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'StatusCare';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'StatusCare';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new StatusCareTransformer();
    }
}
