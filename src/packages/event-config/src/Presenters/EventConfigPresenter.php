<?php

namespace GGPHP\EventConfig\Presenters;

use GGPHP\EventConfig\Transformers\EventConfigTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class EventConfigPresenter.
 *
 * @package namespace App\Presenters;
 */
class EventConfigPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'EventConfig';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'EventConfig';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new EventConfigTransformer();
    }
}
