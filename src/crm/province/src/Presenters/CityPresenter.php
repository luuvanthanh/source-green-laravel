<?php

namespace GGPHP\Crm\Province\Presenters;

use GGPHP\Crm\Province\Transformers\CityTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

/**
 * Class CityPresenter.
 *
 * @package namespace App\Presenters;
 */
class CityPresenter extends FractalPresenter
{
    /**
     * @var string
     */
    public $resourceKeyItem = 'City';

    /**
     * @var string
     */
    public $resourceKeyCollection = 'City';
    /**
     * Transformer
     *
     * @return \League\Fractal\TransformerAbstract
     */
    public function getTransformer()
    {
        return new CityTransformer();
    }
}
