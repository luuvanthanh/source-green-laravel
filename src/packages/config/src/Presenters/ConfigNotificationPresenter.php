<?php

namespace GGPHP\Config\Presenters;

use GGPHP\Config\Transformers\ConfigNotificationTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ConfigNotificationPresenter.
 *
 * @package namespace App\Presenters;
 */
class ConfigNotificationPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ConfigNotification';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ConfigNotification';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ConfigNotificationTransformer();
    }
}
