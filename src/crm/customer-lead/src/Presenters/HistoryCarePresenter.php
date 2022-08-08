<?php

namespace GGPHP\Crm\CustomerLead\Presenters;

use GGPHP\Crm\CustomerLead\Transformers\EventInfoTransformer;
use GGPHP\Crm\CustomerLead\Transformers\HistoryCareTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class HistoryCarePresenter.
 *
 * @package namespace App\Presenters;
 */
class HistoryCarePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'HistoryCare';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'HistoryCare';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new HistoryCareTransformer();
    }
}
