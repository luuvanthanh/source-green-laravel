<?php

namespace GGPHP\Crm\CallCenter\Presenters;

use GGPHP\Crm\CallCenter\Transformers\ManagerCallTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CallCenterPresenter.
 *
 * @package namespace App\Presenters;
 */
class ManagerCallPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'ManagerCall';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'ManagerCall';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ManagerCallTransformer();
    }
}
