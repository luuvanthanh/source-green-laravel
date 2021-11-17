<?php

namespace GGPHP\ActivityLog\Presenters;

use GGPHP\ActivityLog\Transformers\ActivityLogTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class UserPresenter.
 *
 * @package namespace App\Presenters;
 */
class ActivityLogPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ActivityLog';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ActivityLog';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ActivityLogTransformer();
    }
}
