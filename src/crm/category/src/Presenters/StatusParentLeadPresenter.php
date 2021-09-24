<?php

namespace GGPHP\Crm\Category\Presenters;

use GGPHP\Crm\Category\Transformers\StatusParentLeadTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class StatusParentLeadPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'StatusParentLead';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'StatusParentLead';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new StatusParentLeadTransformer();
    }
}
