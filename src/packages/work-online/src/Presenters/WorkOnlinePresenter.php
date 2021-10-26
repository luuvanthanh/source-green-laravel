<?php

namespace GGPHP\WorkOnline\Presenters;

use GGPHP\WorkOnline\Transformers\WorkOnlineTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class WorkOnlinePresenter.
 *
 * @package namespace GGPHP\WorkOnline\Presenters;
 */
class WorkOnlinePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'WorkOnline';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'WorkOnline';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new WorkOnlineTransformer();
    }
}
