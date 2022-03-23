<?php

namespace GGPHP\Crm\CallCenter\Presenters;

use GGPHP\Crm\CallCenter\Transformers\ExtensionTranformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ExtensionPresenter.
 *
 * @package namespace App\Presenters;
 */
class ExtensionPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Extension';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Extension';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ExtensionTranformer();
    }
}
