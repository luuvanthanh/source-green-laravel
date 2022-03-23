<?php

namespace GGPHP\Crm\CallCenter\Presenters;

use GGPHP\Crm\CallCenter\Transformers\HistoryCallTranformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class HistoryCallPresenter.
 *
 * @package namespace App\Presenters;
 */
class HistoryCallPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'HistoryCall';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'HistoryCall';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new HistoryCallTranformer();
    }
}
