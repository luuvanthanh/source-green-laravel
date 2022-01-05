<?php

namespace GGPHP\SystemConfig\Presenters;

use GGPHP\SystemConfig\Transformers\SystemConfigTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class SystemConfigPresenter.
 *
 * @package namespace App\Presenters;
 */
class SystemConfigPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    protected $resourceKeyItem = 'SystemConfig';

    /**
     * @var string
     */
    protected $resourceKeyCollection = 'SystemConfig';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new SystemConfigTransformer();
    }
}
