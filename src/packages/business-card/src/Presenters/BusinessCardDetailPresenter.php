<?php

namespace GGPHP\BusinessCard\Presenters;

use GGPHP\BusinessCard\Transformers\BusinessCardDetailTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class BusinessCardDetailPresenter.
 *
 * @package namespace App\Presenters;
 */
class BusinessCardDetailPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'BusinessCardDetail';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'BusinessCardDetail';

    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new BusinessCardDetailTransformer();
    }
}
