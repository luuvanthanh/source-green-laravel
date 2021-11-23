<?php

namespace GGPHP\Event\Presenters;

use GGPHP\Event\Transformers\EventTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class EventPresenter.
 *
 * @package namespace App\Presenters;
 */
class EventPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'Event';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'Event';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new EventTransformer();
    }
}
