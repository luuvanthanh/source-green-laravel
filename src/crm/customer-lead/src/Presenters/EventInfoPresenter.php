<?php

namespace GGPHP\Crm\CustomerLead\Presenters;

use GGPHP\Crm\CustomerLead\Transformers\EventInfoTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class EventInfoPresenter.
 *
 * @package namespace App\Presenters;
 */
class EventInfoPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'EventInfo';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'EventInfo';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new EventInfoTransformer();
    }
}
