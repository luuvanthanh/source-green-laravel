<?php

namespace GGPHP\Notification\Presenters;

use GGPHP\Notification\Transformers\NotificationTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class NotificationPresenter.
 *
 * @package namespace App\Presenters;
 */
class NotificationPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'Notification';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'Notification';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new NotificationTransformer();
    }
}
