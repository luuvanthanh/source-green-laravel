<?php

namespace GGPHP\Category\Presenters;

use GGPHP\Category\Transformers\ProvinceTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class ProvincePresenter.
 *
 * @package namespace App\Presenters;
 */
class ProvincePresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'Province';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'Province';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new ProvinceTransformer();
    }
}
