<?php

namespace GGPHP\Crm\Icon\Presenters;

use GGPHP\Crm\Icon\Transformers\IconTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CategoryPresenter.
 *
 * @package namespace App\Presenters;
 */
class IconPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Icon';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Icon';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new IconTransformer();
    }
}
