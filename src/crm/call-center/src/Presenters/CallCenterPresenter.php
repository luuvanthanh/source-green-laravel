<?php

namespace GGPHP\Crm\CallCenter\Presenters;

use GGPHP\Crm\CallCenter\Transformers\CallCenterTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CallCenterPresenter.
 *
 * @package namespace App\Presenters;
 */
class CallCenterPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'CallCenter';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'CallCenter';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CallCenterTransformer();
    }
}
