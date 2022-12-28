<?php

namespace GGPHP\ConfigReceiveNotification\Presenters;

use GGPHP\ConfigReceiveNotification\Transformers\ConfigReceiveNotificationTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ConfigReceiveNotificationPresenter.
 *
 * @package namespace App\Presenters;
 */
class ConfigReceiveNotificationPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ConfigReceiveNotification';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ConfigReceiveNotification';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ConfigReceiveNotificationTransformer();
    }
}
