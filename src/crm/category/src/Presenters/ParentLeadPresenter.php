<?php

namespace GGPHP\Crm\Category\Presenters;

use GGPHP\Crm\Category\Transformers\ParentLeadTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class ParentLeadPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ParentLead';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ParentLead';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ParentLeadTransformer();
    }
}
