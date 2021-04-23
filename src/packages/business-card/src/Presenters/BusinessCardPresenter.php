<?php

namespace GGPHP\BusinessCard\Presenters;

use GGPHP\BusinessCard\Transformers\BusinessCardTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class BusinessCardPresenter.
 *
 * @package namespace App\Presenters;
 */
class BusinessCardPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'BusinessCard';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'BusinessCard';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new BusinessCardTransformer();
    }
}
