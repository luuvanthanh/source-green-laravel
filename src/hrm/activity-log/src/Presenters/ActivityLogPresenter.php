<?php

namespace GGPHP\ActivityLog\Presenters;

use GGPHP\ActivityLog\Transformers\ActivityLogTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ActivityLogPresenter.
 *
 * @package namespace App\Presenters;
 */
class ActivityLogPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'ActivityLog';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'ActivityLog';

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
