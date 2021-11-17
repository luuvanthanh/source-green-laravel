<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\EventTypeTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class EventTypePresenter.
 *
 * @package namespace App\Presenters;
 */
class EventTypePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'EventType';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'EventType';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new EventTypeTransformer();
    }
}
