<?php

namespace GGPHP\Crm\CustomerLead\Presenters;

use GGPHP\Crm\CustomerLead\Transformers\StatusLeadTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ReferencePresenter.
 *
 * @package namespace App\Presenters;
 */
class StatusLeadPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'StatusLead';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'StatusLead';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new StatusLeadTransformer();
    }
}
